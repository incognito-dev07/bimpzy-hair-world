const express = require('express');
const router = express.Router();

// Import view files
const layout = require('../views/layout');
const homeView = require('../views/index');
const productsView = require('../views/products');
const bookingView = require('../views/booking');
const adminLoginView = require('../views/admin/login');
const adminDashboardView = require('../views/admin/dashboard');

// API Routes
router.use('/api/products', require('./products'));
router.use('/api/bookings', require('./bookings'));
router.use('/api/admin', require('./admin'));

// Page Routes
router.get('/', (req, res) => {
  res.send(layout('Bimpzy Hair World - Home', homeView(), 'home'));
});

router.get('/products', (req, res) => {
  res.send(layout('Bimpzy Hair World - Products', productsView(), 'products'));
});

router.get('/booking', (req, res) => {
  res.send(layout('Bimpzy Hair World - Booking', bookingView(), 'booking'));
});

router.get('/admin/login', (req, res) => {
  res.send(layout('Admin Login', adminLoginView(), 'admin-login'));
});

router.get('/admin/dashboard', (req, res) => {
  res.send(layout('Admin Dashboard', adminDashboardView(), 'admin-dashboard'));
});

router.get('/api/config', (req, res) => {
  res.json({ whatsappNumber: process.env.WHATSAPP_NUMBER });
});

module.exports = router;