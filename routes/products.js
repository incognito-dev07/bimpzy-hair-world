const express = require('express');
const router = express.Router();
const { query, run, get } = require('../config/database');
const { verifyAdmin } = require('../config/admin');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await query('SELECT id, name, description, price, image_data, created_at FROM products ORDER BY created_at DESC');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await get('SELECT id, name, description, price, image_data FROM products WHERE id = $1', [req.params.id]);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add product (admin only)
router.post('/', verifyAdmin, async (req, res) => {
  const { name, description, price, image_data } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  
  if (!image_data) {
    return res.status(400).json({ error: 'Product image is required' });
  }
  
  try {
    const result = await run(
      `INSERT INTO products (name, description, price, image_data) VALUES ($1, $2, $3, $4) RETURNING id`,
      [name, description, price, image_data]
    );
    res.json({ id: result.lastInsertRowid, message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update product (admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  const { name, description, price, image_data } = req.body;
  
  try {
    const existing = await get('SELECT id FROM products WHERE id = $1', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Product not found' });
    
    if (image_data) {
      await run(
        `UPDATE products SET name = $1, description = $2, price = $3, image_data = $4 WHERE id = $5`,
        [name, description, price, image_data, req.params.id]
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
    const existing = await get('SELECT id FROM products WHERE id = $1', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Product not found' });
    
    await run('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;