const express = require('express');
const router = express.Router();

// API routes
router.use('/api/products', require('./products'));
router.use('/api/bookings', require('./bookings'));
router.use('/api/admin', require('./admin'));

// Page routes
const pages = require('./pages');
router.get('/', pages.home);
router.get('/products', pages.products);
router.get('/booking', pages.booking);
router.get('/admin/login', pages.adminLogin);
router.get('/admin/dashboard', pages.adminDashboard);
router.get('/api/config', pages.config);

module.exports = router;