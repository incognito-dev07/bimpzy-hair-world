const layout = require('../views/layout');
const homeView = require('../views/index');
const productsView = require('../views/products');
const bookingView = require('../views/booking');
const adminLoginView = require('../views/admin/login');
const adminDashboardView = require('../views/admin/dashboard');

exports.home = (req, res) => {
  res.send(layout('Bimpzy Hair World - Home', homeView(), 'home'));
};

exports.products = (req, res) => {
  res.send(layout('Bimpzy Hair World - Products', productsView(), 'products'));
};

exports.booking = (req, res) => {
  res.send(layout('Bimpzy Hair World - Booking', bookingView(), 'booking'));
};

exports.adminLogin = (req, res) => {
  res.send(layout('Admin Login', adminLoginView(), 'admin-login'));
};

exports.adminDashboard = (req, res) => {
  res.send(layout('Admin Dashboard', adminDashboardView(), 'admin-dashboard'));
};

exports.config = (req, res) => {
  res.json({ whatsappNumber: process.env.WHATSAPP_NUMBER });
};