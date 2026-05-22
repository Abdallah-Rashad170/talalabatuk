const pool = require('../config/database');

exports.listRestaurants = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT r.*, u.name as owner_name FROM restaurants r LEFT JOIN users u ON u.id = r.user_id');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل جلب المطاعم' });
  }
};

exports.createRestaurant = async (req, res) => {
  const { user_id, name, description, category, phone, address } = req.body;
  try {
    const [result] = await pool.execute('INSERT INTO restaurants (user_id, name, description, category, phone, address) VALUES (?, ?, ?, ?, ?, ?)', [user_id || null, name, description || null, category || null, phone || null, address || null]);
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل إضافة المطعم' });
  }
};

exports.getRestaurant = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.execute('SELECT * FROM restaurants WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'المطعم غير موجود' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل جلب بيانات المطعم' });
  }
};

exports.updateRestaurant = async (req, res) => {
  const id = req.params.id;
  const fields = req.body;
  const sets = [];
  const vals = [];
  for (const k in fields) { sets.push(`${k} = ?`); vals.push(fields[k]); }
  vals.push(id);
  try {
    await pool.execute(`UPDATE restaurants SET ${sets.join(', ')} WHERE id = ?`, vals);
    res.json({ success: true, message: 'تم التحديث' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل التحديث' });
  }
};

exports.getMenu = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.execute('SELECT * FROM menu_items WHERE restaurant_id = ?', [id]);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل جلب المنيو' });
  }
};

exports.addMenuItem = async (req, res) => {
  const id = req.params.id;
  const { name, price, description } = req.body;
  try {
    const [result] = await pool.execute('INSERT INTO menu_items (restaurant_id, name, price, description) VALUES (?, ?, ?, ?)', [id, name, price || 0, description || null]);
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل إضافة صنف' });
  }
};

exports.updateMenuItem = async (req, res) => {
  const itemId = req.params.itemId;
  const fields = req.body;
  const sets = [];
  const vals = [];
  for (const k in fields) { sets.push(`${k} = ?`); vals.push(fields[k]); }
  vals.push(itemId);
  try {
    await pool.execute(`UPDATE menu_items SET ${sets.join(', ')} WHERE id = ?`, vals);
    res.json({ success: true, message: 'تم التحديث' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل التحديث' });
  }
};

exports.deleteMenuItem = async (req, res) => {
  const itemId = req.params.itemId;
  try {
    await pool.execute('DELETE FROM menu_items WHERE id = ?', [itemId]);
    res.json({ success: true, message: 'تم الحذف' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل الحذف' });
  }
};
