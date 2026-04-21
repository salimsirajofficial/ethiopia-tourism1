const express = require('express');
const cors = require('cors');
const authRouter = require('./modules/auth');
const dashboardRouter = require('./modules/dashboard/presentation/dashboard.routes');
const adminRouter = require('./modules/dashboard/presentation/admin.routes');
const checkoutRouter = require('./modules/checkout/checkout.routes');
const tourismRouter = require('./modules/tourism/presentation/tourism.routes');
const logger = require('./shared/utils/logger');

const path = require('path');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/admin', adminRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/tourism', tourismRouter);


app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


app.use((err, _req, res, _next) => {      // need more explanation how things go here 
  const isProd = process.env.NODE_ENV === 'production';
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Payload too large. Please use a smaller image.' });
  }
  logger.error('Unhandled exception:', err?.stack || err);
  if (!isProd && err?.message) {
    return res.status(500).json({ message: err.message });
  }
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
