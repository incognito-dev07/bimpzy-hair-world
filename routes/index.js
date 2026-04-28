const express = require('express');
const router = express.Router();

const layout = require('../views/layout');
const homeView = require('../views/index');
const productsView = require('../views/products');
const bookingView = require('../views/booking');
const adminLoginView = require('../views/admin/login');
const adminDashboardView = require('../views/admin/dashboard');

router.use('/api/products', require('./products'));
router.use('/api/services', require('./services'));
router.use('/api/admin', require('./admin'));

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

router.use((req, res) => {
  res.status(404).send(layout('Page Not Found - Bimpzy Hair World', `
    <div class="container" style="text-align: center; padding: 4rem 1rem;">
      <h1 style="font-size: 4rem; color: var(--accent-gold);">404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist or has been moved.</p>
      <a href="/" class="btn btn-primary" style="margin-top: 2rem;">Go Back Home</a>
    </div>
  `, 'error'));
});

module.exports = router;