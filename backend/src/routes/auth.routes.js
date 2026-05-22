const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  body('name').isLength({ min: 3 }).withMessage('الاسم مطلوب ويجب أن يكون على الأقل 3 حروف'),
  body('phone').isMobilePhone('ar-EG').withMessage('رقم هاتف غير صالح'),
  body('password').isLength({ min: 6 }).withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  register
);

router.post(
  '/login',
  body('phone').isMobilePhone('ar-EG').withMessage('رقم هاتف غير صالح'),
  body('password').exists().withMessage('كلمة المرور مطلوبة'),
  login
);

module.exports = router;
