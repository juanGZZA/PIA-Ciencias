const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  try {
    const users = db.get('users').filter({ isActive: true }).value();
    const safe = users.map(u => {
      const copy = Object.assign({}, u);
      delete copy.password;
      return copy;
    });
    res.send(safe);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const user = db.get('users').find({ id: req.params.id }).value();
    if (!user) return res.status(404).send({ error: 'Not found' });
    const copy = Object.assign({}, user);
    delete copy.password;
    res.send(copy);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const updated = db.get('users').find({ id: req.params.id }).assign(req.body).write();
    if (!updated) return res.status(404).send({ error: 'Not found' });
    const copy = Object.assign({}, updated);
    delete copy.password;
    res.send(copy);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const user = db.get('users').find({ id: req.params.id }).assign({ isActive: false }).write();
    if (!user) return res.status(404).send({ error: 'Not found' });
    const copy = Object.assign({}, user);
    delete copy.password;
    res.send(copy);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;