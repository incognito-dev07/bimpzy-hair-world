const express = require('express');
const router = express.Router();
const { query, run, get } = require('../config/database');
const { verifyAdmin } = require('../config/admin');
const { body, validationResult } = require('express-validator');

// Validation rules
const productValidation = [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required').escape(),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description').optional().trim().escape(),
  body('image_data').optional().isString()
];

// GET all products
router.get('/', (req, res) => {
  try {
    const products = query('SELECT id, name, description, price, image_data, created_at FROM products ORDER BY created_at DESC');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single product
router.get('/:id', (req, res) => {
  try {
    const product = get('SELECT id, name, description, price, image_data FROM products WHERE id = ?', [req.params.id]);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add product (admin only)
router.post('/', verifyAdmin, productValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  let { name, description, price, image_data } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  
  if (!image_data) {
    return res.status(400).json({ error: 'Product image is required' });
  }
  
  // Sanitize price - remove commas if present
  if (typeof price === 'string') {
    price = parseFloat(price.replace(/,/g, ''));
  }
  
  try {
    const result = run(
      `INSERT INTO products (name, description, price, image_data) VALUES (?, ?, ?, ?)`,
      [name, description, price, image_data]
    );
    res.json({ id: result.lastInsertRowid, message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update product (admin only)
router.put('/:id', verifyAdmin, productValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  let { name, description, price, image_data } = req.body;
  
  // Sanitize price - remove commas if present
  if (typeof price === 'string') {
    price = parseFloat(price.replace(/,/g, ''));
  }
  
  try {
    const existing = get('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Product not found' });
    
    if (image_data) {
      run(
        `UPDATE products SET name = ?, description = ?, price = ?, image_data = ? WHERE id = ?`,
        [name, description, price, image_data, req.params.id]
      );
    } else {
      run(
        `UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?`,
        [name, description, price, req.params.id]
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