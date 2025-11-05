const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');

function userSafe(user) {
  const u = Object.assign({}, user);
  delete u.password;
  return u;
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({ error: 'Name, email and password are required.' });
    }
    const existing = db.get('users').find({ email }).value();
    if (existing) {
      return res.status(409).send({ error: 'Email already in use.' });
    }
    const hashed = await bcrypt.hash(password, 8);
    const user = {
      id: db.genId('u_'),
      name,
      email,
      password: hashed,
      role: 'customer',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    db.get('users').push(user).write();
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).send({ user: userSafe(user), token });
  } catch (error) {
    return res.status(500).send({ error: error.message || 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ error: 'Email and password required.' });
    }
    const user = db.get('users').find({ email, isActive: true }).value();
    if (!user) {
      return res.status(400).send({ error: 'Invalid login credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid login credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.send({ user: userSafe(user), token });
  } catch (error) {
    res.status(500).send({ error: error.message || 'Login failed' });
  }
});

router.get('/profile', async (req, res) => {
  try {
    const auth = req.header('Authorization');
    if (!auth) return res.status(401).send({ error: 'Please authenticate.' });
    const token = auth.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = db.get('users').find({ id: decoded.id, isActive: true }).value();
    if (!user) {
      return res.status(401).send({ error: 'Please authenticate.' });
    }
    res.send(userSafe(user));
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
});

module.exports = router;