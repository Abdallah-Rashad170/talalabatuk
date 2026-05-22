const express = require('express');
const { body, param } = require('express-validator');
const paymentsController = require('../controllers/paymentsController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, paymentsController.listPayments);
router.post('/', verifyToken, body('order_id').isInt(), paymentsController.createPayment);
router.get('/:id', verifyToken, param('id').isInt(), paymentsController.getPayment);

module.exports = router;
