const pool = require('../config/database');
const { generateOrderNumber } = require('../utils/helpers');

exports.listOrders = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل جلب الطلبات' });
  }
};

exports.createOrder = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const orderNumber = generateOrderNumber();
    const {
      customer_id,
      restaurant_id,
      pickup_address,
      delivery_address,
      items = [],
      payment_method
    } = req.body;

    const subtotal = items.reduce((s, i) => s + (i.price * (i.qty || 1)), 0);
    const delivery_fee = parseFloat(process.env.DEFAULT_DELIVERY_FEE || 15);
    const total = subtotal + delivery_fee;
    const pickupAddress = pickup_address || delivery_address || 'عنوان التسليم';
    const deliveryAddress = delivery_address || pickup_address || 'عنوان التوصيل';

    const [orderResult] = await conn.execute(
      `INSERT INTO orders (order_number, customer_id, restaurant_id, pickup_address, delivery_address, subtotal, delivery_fee, total, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderNumber, customer_id, restaurant_id || null, pickupAddress, deliveryAddress, subtotal, delivery_fee, total, payment_method || 'cash']
    );

    const orderId = orderResult.insertId;
    for (const item of items) {
      await conn.execute(
        `INSERT INTO order_items (order_id, name, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.name, item.qty || 1, item.price, (item.price * (item.qty || 1))]
      );
    }

    await conn.commit();
    req.app && req.app.get('io')?.emit('new_order', { orderId, orderNumber });
    res.status(201).json({ success: true, data: { id: orderId, order_number: orderNumber, total } });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل إنشاء الطلب' });
  } finally {
    conn.release();
  }
};

exports.getOrder = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.execute('SELECT * FROM orders WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
    const order = rows[0];
    const [items] = await pool.execute('SELECT * FROM order_items WHERE order_id = ?', [id]);
    order.items = items;
    res.json({ success: true, data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل جلب تفاصيل الطلب' });
  }
};

exports.updateOrder = async (req, res) => {
  const id = req.params.id;
  try {
    const fields = req.body;
    const sets = [];
    const vals = [];
    for (const k in fields) {
      sets.push(`${k} = ?`);
      vals.push(fields[k]);
    }
    if (!sets.length) return res.status(400).json({ success: false, message: 'لا بيانات لتحديثها' });
    vals.push(id);
    await pool.execute(`UPDATE orders SET ${sets.join(', ')} WHERE id = ?`, vals);
    res.json({ success: true, message: 'تم التحديث' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل التحديث' });
  }
};

exports.deleteOrder = async (req, res) => {
  const id = req.params.id;
  try {
    await pool.execute('DELETE FROM orders WHERE id = ?', [id]);
    res.json({ success: true, message: 'تم الحذف' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل الحذف' });
  }
};

exports.updateStatus = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  try {
    await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'تم تغيير الحالة' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل تغيير الحالة' });
  }
};

exports.assignRider = async (req, res) => {
  const id = req.params.id;
  const { rider_id } = req.body;
  try {
    await pool.execute('UPDATE orders SET rider_id = ?, status = ? WHERE id = ?', [rider_id, 'accepted', id]);
    req.app && req.app.get('io')?.emit('order_assigned', { orderId: id, rider_id });
    res.json({ success: true, message: 'تم تعيين المندوب' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل تعيين المندوب' });
  }
};
