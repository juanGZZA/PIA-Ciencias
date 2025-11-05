const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  try {
    const orders = db.get('orders').value();
    res.send(orders);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const payload = req.body;
    const order = Object.assign({
      id: db.genId('o_'),
      customerId: payload.customerId,
      items: payload.items || [],
      subtotal: payload.subtotal || 0,
      tax: payload.tax || 0,
      total: payload.total || 0,
      status: payload.status || 'pending',
      paymentMethod: payload.paymentMethod || 'cash',
      invoiceNumber: payload.invoiceNumber || `INV${Date.now()}`,
      shippingAddress: payload.shippingAddress || {},
      createdAt: new Date().toISOString()
    }, payload);
    db.get('orders').push(order).write();
    res.status(201).send(order);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const order = db.get('orders').find({ id: req.params.id }).value();
    if (!order) return res.status(404).send({ error: 'Not found' });
    res.send(order);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const updated = db.get('orders').find({ id: req.params.id }).assign(req.body).write();
    if (!updated) return res.status(404).send({ error: 'Not found' });
    res.send(updated);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;