const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const routes = require('./src/routes');

const app = express();

const publicRoot = path.join(__dirname, '..');

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny'));

app.use(express.static(publicRoot));

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', apiLimiter);

app.use('/api', routes);

app.get('/api', (req, res) => {
  res.json({ success: true, message: 'Talabatk MakaneK API is running' });
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(publicRoot, 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'الوجهة غير موجودة' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'حصل خطأ في الخادم'
  });
});

module.exports = app;
