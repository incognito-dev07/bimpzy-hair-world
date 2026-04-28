const express = require('express');
const router = express.Router();
const { query, run, get } = require('../config/database');
const { verifyAdmin } = require('../config/admin');
const { upload, cloudinary } = require('../config/cloudinary');

// GET all services
router.get('/', async (req, res) => {
  try {
    const services = await query('SELECT id, name, description, price, category, image_url, created_at FROM services ORDER BY created_at DESC');
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single service
router.get('/:id', async (req, res) => {
  try {
    const service = await get('SELECT id, name, description, price, category, image_url FROM services WHERE id = $1', [req.params.id]);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add service (admin only) - with Cloudinary upload
router.post('/', verifyAdmin, upload.single('image'), async (req, res) => {
  const { name, description, price, category } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  
  if (!req.file) {
    return res.status(400).json({ error: 'Service image is required' });
  }
  
  try {
    const result = await run(
      `INSERT INTO services (name, description, price, category, image_url, image_public_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [name, description, price, category, req.file.path, req.file.filename]
    );
    res.json({ id: result.lastInsertRowid, message: 'Service added successfully', imageUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update service (admin only)
router.put('/:id', verifyAdmin, upload.single('image'), async (req, res) => {
  const { name, description, price, category } = req.body;
  
  try {
    const existing = await get('SELECT id, image_public_id FROM services WHERE id = $1', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Service not found' });
    
    // If new image uploaded, delete old from Cloudinary
    if (req.file && existing.image_public_id) {
      await cloudinary.uploader.destroy(existing.image_public_id);
    }
    
    if (req.file) {
      await run(
        `UPDATE services SET name = $1, description = $2, price = $3, category = $4, image_url = $5, image_public_id = $6 WHERE id = $7`,
        [name, description, price, category, req.file.path, req.file.filename, req.params.id]
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
    const existing = await get('SELECT id, image_public_id FROM services WHERE id = $1', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Service not found' });
    
    // Delete image from Cloudinary
    if (existing.image_public_id) {
      await cloudinary.uploader.destroy(existing.image_public_id);
    }
    
    await run('DELETE FROM services WHERE id = $1', [req.params.id]);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;