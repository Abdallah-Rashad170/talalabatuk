const express = require('express');
const reportsController = require('../controllers/reportsController');
const { verifyToken } = require('../middleware/auth');
const { verifyAdmin } = require('../middleware/roleCheck');

const router = express.Router();

router.get('/daily', verifyToken, verifyAdmin, reportsController.dailyReport);
router.get('/monthly', verifyToken, verifyAdmin, reportsController.monthlyReport);
router.get('/riders', verifyToken, verifyAdmin, reportsController.ridersReport);
router.get('/restaurants', verifyToken, verifyAdmin, reportsController.restaurantsReport);
router.get('/export/pdf', verifyToken, verifyAdmin, reportsController.exportPdf);
router.get('/export/excel', verifyToken, verifyAdmin, reportsController.exportExcel);

module.exports = router;
