const express = require('express');
const authRoutes = require('./auth.routes');
const ordersRoutes = require('./orders.routes');
const ridersRoutes = require('./riders.routes');
const customersRoutes = require('./customers.routes');
const restaurantsRoutes = require('./restaurants.routes');
const reportsRoutes = require('./reports.routes');
const paymentsRoutes = require('./payments.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/orders', ordersRoutes);
router.use('/riders', ridersRoutes);
router.use('/customers', customersRoutes);
router.use('/restaurants', restaurantsRoutes);
router.use('/reports', reportsRoutes);
router.use('/payments', paymentsRoutes);
router.use('/dashboard', dashboardRoutes);

router.get('/', (req, res) => {
  res.json({ success: true, message: 'API root reached' });
});

module.exports = router;
