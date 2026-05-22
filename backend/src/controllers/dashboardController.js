const pool = require('../config/database');

exports.overview = async (req, res) => {
  try {
    const [orderCountRows] = await pool.execute('SELECT COUNT(*) AS count FROM orders');
    const [revenueRows] = await pool.execute("SELECT SUM(total) AS revenue FROM orders WHERE DATE(created_at) = DATE(NOW())");
    const [riderRows] = await pool.execute("SELECT COUNT(*) AS count FROM riders WHERE status = 'online'");
    const [customerRows] = await pool.execute('SELECT COUNT(*) AS count FROM customers');
    const [orders] = await pool.execute(
      `SELECT o.id, o.order_number, o.total, o.status, o.created_at,
              u.name AS customer_name,
              ru.name AS rider_name,
              rest.name AS restaurant_name,
              COALESCE(o.delivery_address, o.pickup_address) AS location
       FROM orders o
       LEFT JOIN customers c ON c.id = o.customer_id
       LEFT JOIN users u ON u.id = c.user_id
       LEFT JOIN riders r ON r.id = o.rider_id
       LEFT JOIN users ru ON ru.id = r.user_id
       LEFT JOIN restaurants rest ON rest.id = o.restaurant_id
       ORDER BY o.created_at DESC
       LIMIT 6`
    );

    const [weeklyRows] = await pool.execute(
      `SELECT DATE(created_at) AS date, COUNT(*) AS orders_count, SUM(total) AS revenue
       FROM orders
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date`
    );

    const [statusCounts] = await pool.execute(
      `SELECT status, COUNT(*) AS count FROM orders GROUP BY status`
    );

    const statusMap = statusCounts.reduce((acc, row) => {
      acc[row.status] = row.count;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totals: {
          totalOrders: orderCountRows[0]?.count || 0,
          dailyRevenue: parseFloat(revenueRows[0]?.revenue || 0),
          activeRiders: riderRows[0]?.count || 0,
          totalCustomers: customerRows[0]?.count || 0
        },
        weeklyPerformance: weeklyRows.map((row) => ({
          date: row.date,
          orders: row.orders_count,
          revenue: parseFloat(row.revenue || 0)
        })),
        orders: orders.map((order) => ({
          id: order.id,
          order_number: order.order_number,
          total: parseFloat(order.total || 0),
          status: order.status,
          created_at: order.created_at,
          customer_name: order.customer_name || 'غير محدد',
          rider_name: order.rider_name || 'غير معين',
          restaurant_name: order.restaurant_name || 'غير محدد',
          location: order.location || 'غير محدد'
        })),
        statusCounts: statusMap
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'فشل جلب بيانات لوحة القيادة' });
  }
};
