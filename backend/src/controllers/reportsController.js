const pool = require('../config/database');
const PDFDocument = require('pdfkit');

exports.dailyReport = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT DATE(created_at) as date, COUNT(*) as orders_count, SUM(total) as revenue FROM orders WHERE DATE(created_at)=DATE(NOW()) GROUP BY DATE(created_at)");
    res.json({ success: true, data: rows[0] || { orders_count:0, revenue:0 } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل جلب التقرير اليومي' });
  }
};

exports.monthlyReport = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, COUNT(*) as orders_count, SUM(total) as revenue FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d') ORDER BY date");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل جلب التقرير الشهري' });
  }
};

exports.ridersReport = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT r.id, u.name, COUNT(o.id) as orders_count FROM riders r LEFT JOIN users u ON u.id = r.user_id LEFT JOIN orders o ON o.rider_id = r.id GROUP BY r.id');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل جلب تقرير المناديب' });
  }
};

exports.restaurantsReport = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT rest.id, rest.name, COUNT(o.id) as orders_count, SUM(o.total) as revenue FROM restaurants rest LEFT JOIN orders o ON o.restaurant_id = rest.id GROUP BY rest.id');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل جلب تقرير المطاعم' });
  }
};

exports.exportPdf = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, COUNT(*) as orders_count, SUM(total) as revenue FROM orders GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d') ORDER BY date DESC LIMIT 50");
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reports.pdf"');

    doc.pipe(res);
    doc.fontSize(18).text('تقرير الطلبات', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`تاريخ التصدير: ${new Date().toLocaleDateString('ar-EG')}`, { align: 'center' });
    doc.moveDown(1);

    const tableTop = doc.y;
    const col1 = 50;
    const col2 = 220;
    const col3 = 360;
    doc.fontSize(11).font('Helvetica-Bold');
    doc.text('التاريخ', col1, tableTop, { width: 120, align: 'right' });
    doc.text('عدد الطلبات', col2, tableTop, { width: 120, align: 'right' });
    doc.text('الإيرادات', col3, tableTop, { width: 120, align: 'right' });
    doc.moveDown(0.8);
    doc.font('Helvetica');

    rows.forEach((row) => {
      const y = doc.y;
      const revenue = row.revenue == null ? 0 : Number(row.revenue);
      doc.text(row.date, col1, y, { width: 120, align: 'right' });
      doc.text(String(row.orders_count), col2, y, { width: 120, align: 'right' });
      doc.text(revenue.toFixed(2), col3, y, { width: 120, align: 'right' });
      doc.moveDown(0.7);
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل تصدير التقرير كـ PDF' });
  }
};

exports.exportExcel = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, COUNT(*) as orders_count, SUM(total) as revenue FROM orders GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d') ORDER BY date DESC");
    const header = 'التاريخ,عدد الطلبات,الإيرادات';
    const csvRows = rows.map(row => {
      const revenue = row.revenue == null ? 0 : Number(row.revenue);
      return `${row.date},${row.orders_count},${revenue.toFixed(2)}`;
    });
    const csv = [header, ...csvRows].join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=UTF-8');
    res.setHeader('Content-Disposition', 'attachment; filename="reports.csv"');
    res.send('\uFEFF' + csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل تصدير التقرير كـ Excel' });
  }
};
