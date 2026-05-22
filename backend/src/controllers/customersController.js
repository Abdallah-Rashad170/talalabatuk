const pool = require('../config/database');

exports.listCustomers = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT c.*, u.name, u.phone FROM customers c JOIN users u ON u.id = c.user_id');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل جلب العملاء' });
  }
};

exports.getCustomer = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.execute('SELECT c.*, u.name, u.phone FROM customers c JOIN users u ON u.id = c.user_id WHERE c.id = ?', [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'العميل غير موجود' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل جلب بيانات العميل' });
  }
};

exports.updateCustomer = async (req, res) => {
  const id = req.params.id;
  const fields = req.body;
  const sets = [];
  const vals = [];
  for (const k in fields) { sets.push(`${k} = ?`); vals.push(fields[k]); }
  vals.push(id);
  try {
    await pool.execute(`UPDATE customers SET ${sets.join(', ')} WHERE id = ?`, vals);
    res.json({ success: true, message: 'تم التحديث' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل التحديث' });
  }
};

exports.getOrders = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.execute('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC', [id]);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل جلب طلبات العميل' });
  }
};

exports.getAddresses = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.execute('SELECT * FROM customer_addresses WHERE customer_id = ?', [id]);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل جلب العناوين' });
  }
};

exports.addAddress = async (req, res) => {
  const id = req.params.id;
  const { label, address, lat, lng, is_default } = req.body;
  try {
    const [result] = await pool.execute('INSERT INTO customer_addresses (customer_id, label, address, lat, lng, is_default) VALUES (?, ?, ?, ?, ?, ?)', [id, label || null, address, lat || null, lng || null, is_default ? 1 : 0]);
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل إضافة العنوان' });
  }
};
