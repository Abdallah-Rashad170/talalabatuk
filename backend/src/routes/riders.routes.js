const express = require('express');
const { body, param } = require('express-validator');
const ridersController = require('../controllers/ridersController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, ridersController.listRiders);
router.post('/', verifyToken, body('user_id').isInt(), ridersController.createRider);
router.get('/:id', verifyToken, param('id').isInt(), ridersController.getRider);
router.put('/:id', verifyToken, param('id').isInt(), ridersController.updateRider);
router.delete('/:id', verifyToken, param('id').isInt(), ridersController.deleteRider);
router.patch('/:id/status', verifyToken, param('id').isInt(), ridersController.changeStatus);
router.patch('/:id/location', verifyToken, param('id').isInt(), ridersController.updateLocation);

module.exports = router;
