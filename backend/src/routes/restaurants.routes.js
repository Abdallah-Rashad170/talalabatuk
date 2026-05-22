const express = require('express');
const { body, param } = require('express-validator');
const restaurantsController = require('../controllers/restaurantsController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, restaurantsController.listRestaurants);
router.post('/', verifyToken, body('name').notEmpty(), restaurantsController.createRestaurant);
router.get('/:id', verifyToken, param('id').isInt(), restaurantsController.getRestaurant);
router.put('/:id', verifyToken, param('id').isInt(), restaurantsController.updateRestaurant);
router.get('/:id/menu', verifyToken, restaurantsController.getMenu);
router.post('/:id/menu', verifyToken, body('name').notEmpty(), restaurantsController.addMenuItem);
router.put('/:id/menu/:itemId', verifyToken, param('itemId').isInt(), restaurantsController.updateMenuItem);
router.delete('/:id/menu/:itemId', verifyToken, param('itemId').isInt(), restaurantsController.deleteMenuItem);

module.exports = router;
