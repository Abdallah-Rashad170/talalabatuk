const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret_key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { name, phone, email, password, role = 'customer' } = req.body;
  console.log('register body:', req.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [existing] = await pool.execute('SELECT id FROM users WHERE phone = ? OR email = ?', [phone, email || null]);
    if (existing.length) {
      return res.status(409).json({ success: false, message: 'المستخدم موجود بالفعل' });
    }

    const [result] = await pool.execute(
      'INSERT INTO users (name, phone, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, phone, email || null, hashedPassword, role]
    );

    const token = createToken({ id: result.insertId, name, phone, role });
    res.status(201).json({ success: true, data: { id: result.insertId, name, phone, role }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل التسجيل' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { phone, password } = req.body;
  try {
    const [rows] = await pool.execute('SELECT id, name, phone, email, password, role FROM users WHERE phone = ?', [phone]);
    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'بيانات تسجيل الدخول غير صحيحة' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'بيانات تسجيل الدخول غير صحيحة' });
    }

    const token = createToken({ id: user.id, name: user.name, phone: user.phone, role: user.role });
    res.json({ success: true, data: { id: user.id, name: user.name, phone: user.phone, role: user.role }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'خطأ في تسجيل الدخول' });
  }
};
