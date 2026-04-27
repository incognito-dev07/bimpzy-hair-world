const express = require('express');
const router = express.Router();
const { query, run, get } = require('../config/database');
const { verifyAdmin } = require('../config/admin');

// GET all services
router.get('/', (req, res) => {
  try {
    const services = query('SELECT id, name, description, price, category, image_data, created_at FROM services ORDER BY created_at DESC');
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single service
router.get('/:id', (req, res) => {
  try {
    const service = get('SELECT id, name, description, price, category, image_data FROM services WHERE id = ?', [req.params.id]);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add service (admin only)
router.post('/', verifyAdmin, (req, res) => {
  const { name, description, price, category, image_data } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  
  if (!image_data) {
    return res.status(400).json({ error: 'Service image is required' });
  }
  
  try {
    const result = run(
      `INSERT INTO services (name, description, price, category, image_data) VALUES (?, ?, ?, ?, ?)`,
      [name, description, price, category, image_data]
    );
    res.json({ id: result.lastInsertRowid, message: 'Service added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update service (admin only)
router.put('/:id', verifyAdmin, (req, res) => {
  const { name, description, price, category, image_data } = req.body;
  
  try {
    const existing = get('SELECT id FROM services WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Service not found' });
    
    if (image_data) {
      run(
        `UPDATE services SET name = ?, description = ?, price = ?, category = ?, image_data = ? WHERE id = ?`,
        [name, description, price, category, image_data, req.params.id]
      );
    } else {
      run(
        `UPDATE services SET name = ?, description = ?, price = ?, category = ? WHERE id = ?`,
        [name, description, price, category, req.params.id]
      );
    }
    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE service (admin only)
router.delete('/:id', verifyAdmin, (req, res) => {
  try {
    const existing = get('SELECT id FROM services WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Service not found' });
    
    run('DELETE FROM services WHERE id = ?', [req.params.id]);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;