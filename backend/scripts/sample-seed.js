const pool = require('../src/config/database');
const bcrypt = require('bcrypt');
const { generateOrderNumber } = require('../src/utils/helpers');

const ensureUser = async (user) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE phone = ?', [user.phone]);
  if (rows.length) return rows[0];

  const hashed = await bcrypt.hash(user.password, 10);
  const [result] = await pool.execute(
    'INSERT INTO users (name, phone, email, password, role) VALUES (?, ?, ?, ?, ?)',
    [user.name, user.phone, user.email, hashed, user.role]
  );
  return { id: result.insertId, ...user };
};

const ensureCustomer = async (userId) => {
  const [rows] = await pool.execute('SELECT * FROM customers WHERE user_id = ?', [userId]);
  if (rows.length) return rows[0];
  const [result] = await pool.execute('INSERT INTO customers (user_id, total_orders, total_spent, wallet_balance) VALUES (?, 0, 0, 0)', [userId]);
  return { id: result.insertId, user_id: userId };
};

const ensureRestaurant = async (userId) => {
  const [rows] = await pool.execute('SELECT * FROM restaurants WHERE user_id = ?', [userId]);
  if (rows.length) return rows[0];
  const [result] = await pool.execute(
    'INSERT INTO restaurants (user_id, name, description, category, phone, address, area, min_order, delivery_fee) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [userId, 'مطعم البلينا', 'أفضل الأكلات المحلية السريعة', 'مطاعم', '01234567890', 'شارع السوق، البلينا', 'البلينا', 50, 15]
  );
  return { id: result.insertId, user_id: userId };
};

const ensureRider = async (userId) => {
  const [rows] = await pool.execute('SELECT * FROM riders WHERE user_id = ?', [userId]);
  if (rows.length) return rows[0];
  const [result] = await pool.execute(
    'INSERT INTO riders (user_id, national_id, bike_plate, area, status, total_orders, total_earnings, rating, rating_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [userId, '12345678901234', 'ع ع د 1234', 'البلينا', 'online', 0, 0, 4.9, 12]
  );
  return { id: result.insertId, user_id: userId };
};

const insertOrder = async ({ customerId, restaurantId, riderId, status, paymentMethod, paymentStatus, items, createdAt }) => {
  const orderNumber = generateOrderNumber();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 15;
  const total = subtotal + deliveryFee;

  const [result] = await pool.execute(
    `INSERT INTO orders (order_number, customer_id, restaurant_id, rider_id, pickup_address, delivery_address, subtotal, delivery_fee, discount, total, status, payment_method, payment_status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      orderNumber,
      customerId,
      restaurantId,
      riderId,
      'شارع السوق، البلينا',
      'حي البستان، البلينا',
      subtotal,
      deliveryFee,
      0,
      total,
      status,
      paymentMethod,
      paymentStatus,
      createdAt
    ]
  );

  const orderId = result.insertId;
  for (const item of items) {
    await pool.execute(
      'INSERT INTO order_items (order_id, menu_item_id, name, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?)',
      [orderId, null, item.name, item.quantity, item.price, item.price * item.quantity]
    );
  }

  if (paymentStatus === 'paid') {
    await pool.execute('INSERT INTO payments (order_id, amount, method, status, transaction_id) VALUES (?, ?, ?, ?, ?)', [orderId, total, paymentMethod, 'completed', `TX-${orderNumber}`]);
  }

  await pool.execute('UPDATE customers SET total_orders = total_orders + 1, total_spent = total_spent + ? WHERE id = ?', [total, customerId]);
  await pool.execute('UPDATE restaurants SET total_orders = total_orders + 1, total_revenue = total_revenue + ? WHERE id = ?', [total, restaurantId]);
  if (riderId) {
    await pool.execute('UPDATE riders SET total_orders = total_orders + 1, total_earnings = total_earnings + ? WHERE id = ?', [total * 0.8, riderId]);
  }

  return orderId;
};

(async () => {
  try {
    console.log('Seeding sample data...');

    const customerUser = await ensureUser({ name: 'عميل تجريبي', phone: '01000000001', email: 'customer@talabatk.local', password: 'Customer@123', role: 'customer' });
    const restaurantUser = await ensureUser({ name: 'مالك مطعم', phone: '01000000002', email: 'restaurant@talabatk.local', password: 'Restaurant@123', role: 'restaurant' });
    const riderUser = await ensureUser({ name: 'مندوب تجريبي', phone: '01000000003', email: 'rider@talabatk.local', password: 'Rider@123', role: 'rider' });

    const customer = await ensureCustomer(customerUser.id);
    const restaurant = await ensureRestaurant(restaurantUser.id);
    const rider = await ensureRider(riderUser.id);

    const order1 = await insertOrder({
      customerId: customer.id,
      restaurantId: restaurant.id,
      riderId: rider.id,
      status: 'delivered',
      paymentMethod: 'cash',
      paymentStatus: 'paid',
      items: [
        { name: 'كريب دجاج', quantity: 1, price: 65 },
        { name: 'بيبسي', quantity: 2, price: 12 }
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString().slice(0, 19).replace('T', ' ')
    });

    const order2 = await insertOrder({
      customerId: customer.id,
      restaurantId: restaurant.id,
      riderId: rider.id,
      status: 'on_the_way',
      paymentMethod: 'online',
      paymentStatus: 'pending',
      items: [
        { name: 'برجر لحم', quantity: 1, price: 75 },
        { name: 'بطاطس مقلية', quantity: 1, price: 20 }
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString().slice(0, 19).replace('T', ' ')
    });

    console.log('Sample data seeded:', { customerUser, restaurantUser, riderUser, order1, order2 });
  } catch (err) {
    console.error('Sample seed error:', err);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
})();
