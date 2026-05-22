const pool = require('../config/database');

exports.listRiders = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT r.*, u.name, u.phone FROM riders r JOIN users u ON u.id = r.user_id');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل جلب المناديب' });
  }
};

exports.createRider = async (req, res) => {
  const { user_id, national_id, bike_plate, area } = req.body;
  try {
    const [result] = await pool.execute('INSERT INTO riders (user_id, national_id, bike_plate, area) VALUES (?, ?, ?, ?)', [user_id, national_id || null, bike_plate || null, area || null]);
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل إضافة المندوب' });
  }
};

exports.getRider = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.execute('SELECT * FROM riders WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'المندوب غير موجود' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل جلب بيانات المندوب' });
  }
};

exports.updateRider = async (req, res) => {
  const id = req.params.id;
  const fields = req.body;
  const sets = [];
  const vals = [];
  for (const k in fields) { sets.push(`${k} = ?`); vals.push(fields[k]); }
  vals.push(id);
  try {
    await pool.execute(`UPDATE riders SET ${sets.join(', ')} WHERE id = ?`, vals);
    res.json({ success: true, message: 'تم التحديث' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل التحديث' });
  }
};

exports.deleteRider = async (req, res) => {
  const id = req.params.id;
  try {
    await pool.execute('DELETE FROM riders WHERE id = ?', [id]);
    res.json({ success: true, message: 'تم الحذف' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل الحذف' });
  }
};

exports.changeStatus = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  try {
    await pool.execute('UPDATE riders SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'تم تغيير الحالة' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل تغيير الحالة' });
  }
};

exports.updateLocation = async (req, res) => {
  const id = req.params.id;
  const { lat, lng } = req.body;
  try {
    await pool.execute('UPDATE riders SET lat = ?, lng = ? WHERE id = ?', [lat, lng, id]);
    res.json({ success: true, message: 'تم تحديث الموقع' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل تحديث الموقع' });
  }
};
