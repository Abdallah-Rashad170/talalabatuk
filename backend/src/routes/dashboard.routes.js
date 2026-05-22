const express = require('express');
const { overview } = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/auth');
const { verifyAdmin } = require('../middleware/roleCheck');

const router = express.Router();

router.get('/overview', verifyToken, verifyAdmin, overview);

module.exports = router;
