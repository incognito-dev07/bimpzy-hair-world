const express = require('express');
const router = express.Router();
const { query, run, get } = require('../config/database');
const { verifyAdmin } = require('../config/admin');
const { upload, cloudinary } = require('../config/cloudinary');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await query('SELECT id, name, description, price, image_url, created_at FROM products ORDER BY created_at DESC');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await get('SELECT id, name, description, price, image_url FROM products WHERE id = $1', [req.params.id]);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add product (admin only) - with Cloudinary upload
router.post('/', verifyAdmin, upload.single('image'), async (req, res) => {
  const { name, description, price } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  
  if (!req.file) {
    return res.status(400).json({ error: 'Product image is required' });
  }
  
  try {
    const result = await run(
      `INSERT INTO products (name, description, price, image_url, image_public_id) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [name, description, price, req.file.path, req.file.filename]
    );
    res.json({ id: result.lastInsertRowid, message: 'Product added successfully', imageUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update product (admin only)
router.put('/:id', verifyAdmin, upload.single('image'), async (req, res) => {
  const { name, description, price } = req.body;
  
  try {
    const existing = await get('SELECT id, image_public_id FROM products WHERE id = $1', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Product not found' });
    
    // If new image uploaded, delete old from Cloudinary
    if (req.file && existing.image_public_id) {
      await cloudinary.uploader.destroy(existing.image_public_id);
    }
    
    if (req.file) {
      await run(
        `UPDATE products SET name = $1, description = $2, price = $3, image_url = $4, image_public_id = $5 WHERE id = $6`,
        [name, description, price, req.file.path, req.file.filename, req.params.id]
      );
    } else {
      await run(
        `UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4`,
        [name, description, price, req.params.id]
      );
    }
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE product (admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const existing = await get('SELECT id, image_public_id FROM products WHERE id = $1', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Product not found' });
    
    // Delete image from Cloudinary
    if (existing.image_public_id) {
      await cloudinary.uploader.destroy(existing.image_public_id);
    }
    
    await run('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;