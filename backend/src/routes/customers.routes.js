const express = require('express');
const { body, param } = require('express-validator');
const customersController = require('../controllers/customersController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, customersController.listCustomers);
router.get('/:id', verifyToken, param('id').isInt(), customersController.getCustomer);
router.put('/:id', verifyToken, param('id').isInt(), customersController.updateCustomer);
router.get('/:id/orders', verifyToken, param('id').isInt(), customersController.getOrders);
router.get('/:id/addresses', verifyToken, param('id').isInt(), customersController.getAddresses);
router.post('/:id/addresses', verifyToken, param('id').isInt(), body('address').notEmpty(), customersController.addAddress);

module.exports = router;
