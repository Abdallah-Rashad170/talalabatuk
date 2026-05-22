const express = require('express');
const { body, param } = require('express-validator');
const ordersController = require('../controllers/ordersController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, ordersController.listOrders);
router.post(
  '/',
  verifyToken,
  body('customer_id').isInt().withMessage('customer_id مطلوب'),
  body('delivery_address').notEmpty().withMessage('delivery_address مطلوب'),
  ordersController.createOrder
);
router.get('/:id', verifyToken, param('id').isInt(), ordersController.getOrder);
router.put('/:id', verifyToken, param('id').isInt(), ordersController.updateOrder);
router.delete('/:id', verifyToken, param('id').isInt(), ordersController.deleteOrder);
router.patch('/:id/status', verifyToken, param('id').isInt(), ordersController.updateStatus);
router.patch('/:id/assign', verifyToken, param('id').isInt(), ordersController.assignRider);

module.exports = router;
