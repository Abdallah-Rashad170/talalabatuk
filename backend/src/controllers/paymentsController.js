const pool = require('../config/database');

exports.listPayments = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT p.*, o.order_number FROM payments p JOIN orders o ON o.id = p.order_id ORDER BY p.created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل جلب المدفوعات' });
  }
};

exports.createPayment = async (req, res) => {
  const { order_id, amount, method, transaction_id } = req.body;
  try {
    const [result] = await pool.execute('INSERT INTO payments (order_id, amount, method, status, transaction_id) VALUES (?, ?, ?, ?, ?)', [order_id, amount, method || 'cash', 'completed', transaction_id || null]);
    await pool.execute('UPDATE orders SET payment_status = ? WHERE id = ?', ['paid', order_id]);
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل تسجيل الدفع' });
  }
};

exports.getPayment = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.execute('SELECT * FROM payments WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'الدفعة غير موجودة' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل جلب الدفعة' });
  }
};
