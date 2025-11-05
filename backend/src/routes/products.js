const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  try {
    const products = db.get('products').filter({ isActive: true }).value();
    res.send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const payload = req.body;
    const product = Object.assign({
      id: db.genId('p_'),
      name: payload.name || 'Unnamed',
      description: payload.description || '',
      price: payload.price || 0,
      stock: payload.stock || 0,
      category: payload.category || '',
      sku: payload.sku || '',
      barcode: payload.barcode || '',
      images: payload.images || [],
      isActive: payload.isActive !== undefined ? payload.isActive : true,
      createdAt: new Date().toISOString()
    }, payload);
    db.get('products').push(product).write();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const product = db.get('products').find({ id: req.params.id }).value();
    if (!product) return res.status(404).send({ error: 'Not found' });
    res.send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const updated = db.get('products').find({ id: req.params.id }).assign(req.body).write();
    if (!updated) return res.status(404).send({ error: 'Not found' });
    res.send(updated);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const product = db.get('products').find({ id: req.params.id }).assign({ isActive: false }).write();
    if (!product) return res.status(404).send({ error: 'Not found' });
    res.send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;