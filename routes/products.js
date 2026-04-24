const express = require('express');
const router = express.Router();
const { query, run, get } = require('../config/database');
const { verifyAdmin } = require('../config/middleware');

// GET all products
router.get('/', (req, res) => {
  try {
    const products = query('SELECT id, name, description, price, category, image_data, created_at FROM products ORDER BY created_at DESC');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single product
router.get('/:id', (req, res) => {
  try {
    const product = get('SELECT id, name, description, price, category, image_data FROM products WHERE id = ?', [req.params.id]);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add product with image (admin only)
router.post('/', verifyAdmin, (req, res) => {
  const { name, description, price, category, image_data } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  
  if (!image_data) {
    return res.status(400).json({ error: 'Product image is required' });
  }
  
  try {
    const result = run(
      `INSERT INTO products (name, description, price, category, image_data) VALUES (?, ?, ?, ?, ?)`,
      [name, description, price, category, image_data]
    );
    res.json({ id: result.lastInsertRowid, message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update product (admin only)
router.put('/:id', verifyAdmin, (req, res) => {
  const { name, description, price, category, image_data } = req.body;
  
  try {
    const existing = get('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Product not found' });
    
    if (image_data) {
      run(
        `UPDATE products SET name = ?, description = ?, price = ?, category = ?, image_data = ? WHERE id = ?`,
        [name, description, price, category, image_data, req.params.id]
      );
    } else {
      run(
        `UPDATE products SET name = ?, description = ?, price = ?, category = ? WHERE id = ?`,
        [name, description, price, category, req.params.id]
      );
    }
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE product (admin only)
router.delete('/:id', verifyAdmin, (req, res) => {
  try {
    const existing = get('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Product not found' });
    
    run('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;