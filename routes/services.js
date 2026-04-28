const express = require('express');
const router = express.Router();
const { query, run, get } = require('../config/database');
const { verifyAdmin } = require('../config/admin');

// GET all services
router.get('/', async (req, res) => {
  try {
    const services = await query('SELECT id, name, description, price, category, image_data, created_at FROM services ORDER BY created_at DESC');
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single service
router.get('/:id', async (req, res) => {
  try {
    const service = await get('SELECT id, name, description, price, category, image_data FROM services WHERE id = $1', [req.params.id]);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add service (admin only)
router.post('/', verifyAdmin, async (req, res) => {
  const { name, description, price, category, image_data } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  
  if (!image_data) {
    return res.status(400).json({ error: 'Service image is required' });
  }
  
  try {
    const result = await run(
      `INSERT INTO services (name, description, price, category, image_data) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [name, description, price, category, image_data]
    );
    res.json({ id: result.lastInsertRowid, message: 'Service added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update service (admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  const { name, description, price, category, image_data } = req.body;
  
  try {
    const existing = await get('SELECT id FROM services WHERE id = $1', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Service not found' });
    
    if (image_data) {
      await run(
        `UPDATE services SET name = $1, description = $2, price = $3, category = $4, image_data = $5 WHERE id = $6`,
        [name, description, price, category, image_data, req.params.id]
      );
    } else {
      await run(
        `UPDATE services SET name = $1, description = $2, price = $3, category = $4 WHERE id = $5`,
        [name, description, price, category, req.params.id]
      );
    }
    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE service (admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const existing = await get('SELECT id FROM services WHERE id = $1', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Service not found' });
    
    await run('DELETE FROM services WHERE id = $1', [req.params.id]);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;