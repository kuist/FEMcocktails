const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user.id;
      req.session.isAdmin = user.isAdmin;
      res.redirect('/');
    } else {
      res.render('login', { error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Server error' });
  }
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });
    res.redirect('/auth/login');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Registration failed' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect('/');
  });
});

module.exports = router;