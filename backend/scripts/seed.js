const pool = require('../src/config/database');
const bcrypt = require('bcrypt');

(async () => {
  try {
    console.log('Running seed...');
    // Insert default settings
    const settings = [
      ['company_name','طلباتك مكانك','اسم الشركة'],
      ['whatsapp_number','201015819017','رقم واتساب الشركة'],
      ['default_delivery_fee','15','رسوم التوصيل الافتراضية بالجنيه'],
      ['max_delivery_distance','15','أقصى مسافة توصيل بالكيلومتر']
    ];
    for (const s of settings) {
      await pool.execute('INSERT IGNORE INTO settings (`key`, value, description) VALUES (?, ?, ?)', s);
    }

    // Insert admin user if not exists
    const adminPhone = '01015819017';
    const [rows] = await pool.execute('SELECT id, password FROM users WHERE phone = ?', [adminPhone]);
    if (rows.length) {
      const adminUser = rows[0];
      if (adminUser.password === '$2b$10$HASHED_PASSWORD_HERE') {
        const hashed = await bcrypt.hash('Admin@123', 10);
        await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashed, adminUser.id]);
        console.log('Updated placeholder admin password.');
        process.exit(0);
      }
      console.log('Admin user already exists.');
      process.exit(0);
    }

    const hashed = await bcrypt.hash('Admin@123', 10);
    const [res] = await pool.execute('INSERT INTO users (name, phone, email, password, role) VALUES (?, ?, ?, ?, ?)', ['مدير النظام', adminPhone, 'admin@talabatk.com', hashed, 'admin']);
    console.log('Inserted admin id:', res.insertId);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
})();
