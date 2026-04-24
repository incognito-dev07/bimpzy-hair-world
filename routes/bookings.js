const express = require('express');
const router = express.Router();
const { query, run, get } = require('../config/database');
const { verifyAdmin } = require('../config/middleware');

// POST create booking (public)
router.post('/', (req, res) => {
  const { customer_name, customer_phone, booking_date, booking_time, service_type } = req.body;
  
  if (!customer_name || !booking_date || !booking_time) {
    return res.status(400).json({ error: 'Name, date, and time are required' });
  }
  
  try {
    const result = run(
      `INSERT INTO bookings (customer_name, customer_phone, booking_date, booking_time, service_type, status) VALUES (?, ?, ?, ?, ?, 'pending')`,
      [customer_name, customer_phone, booking_date, booking_time, service_type || null]
    );
    res.json({ id: result.lastInsertRowid, message: 'Booking created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all bookings (admin only)
router.get('/', verifyAdmin, (req, res) => {
  try {
    const bookings = query('SELECT * FROM bookings ORDER BY booking_date DESC, booking_time ASC');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update booking status (admin only)
router.put('/:id/status', verifyAdmin, (req, res) => {
  const { status } = req.body;
  
  if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Valid status is required' });
  }
  
  try {
    const existing = get('SELECT id FROM bookings WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Booking not found' });
    
    run('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: `Booking ${status} successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;