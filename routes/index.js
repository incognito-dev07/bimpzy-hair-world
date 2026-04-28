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
router.use('/api/services', require('./services'));
router.use('/api/admin', require('./admin'));

// Page Routes with error handling
router.get('/', (req, res) => {
  try {
    res.send(layout('Bimpzy Hair World - Home', homeView(), 'home'));
  } catch (error) {
    console.error('Home page error:', error);
    res.status(500).send('Error loading home page');
  }
});

router.get('/products', (req, res) => {
  try {
    res.send(layout('Bimpzy Hair World - Products', productsView(), 'products'));
  } catch (error) {
    console.error('Products page error:', error);
    res.status(500).send('Error loading products page');
  }
});

router.get('/booking', (req, res) => {
  try {
    res.send(layout('Bimpzy Hair World - Booking', bookingView(), 'booking'));
  } catch (error) {
    console.error('Booking page error:', error);
    res.status(500).send('Error loading booking page');
  }
});

router.get('/admin/login', (req, res) => {
  try {
    res.send(layout('Admin Login', adminLoginView(), 'admin-login'));
  } catch (error) {
    console.error('Admin login page error:', error);
    res.status(500).send('Error loading admin login page');
  }
});

router.get('/admin/dashboard', (req, res) => {
  try {
    res.send(layout('Admin Dashboard', adminDashboardView(), 'admin-dashboard'));
  } catch (error) {
    console.error('Admin dashboard page error:', error);
    res.status(500).send('Error loading admin dashboard');
  }
});

router.get('/api/config', (req, res) => {
  try {
    res.json({ whatsappNumber: process.env.WHATSAPP_NUMBER });
  } catch (error) {
    console.error('Config error:', error);
    res.status(500).json({ error: 'Failed to load config' });
  }
});

module.exports = router;