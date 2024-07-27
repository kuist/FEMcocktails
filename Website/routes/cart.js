const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', (req, res) => {
  res.render('cart', { title: 'Your Cart', cart: req.session.cart || [] });
});

router.post('/add', async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (!req.session.cart) {
      req.session.cart = [];
    }
    
    const cartItem = req.session.cart.find(item => item.id === productId);
    if (cartItem) {
      cartItem.quantity += parseInt(quantity);
    } else {
      req.session.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: parseInt(quantity)
      });
    }
    
    res.json({ message: 'Product added to cart', cart: req.session.cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/remove', (req, res) => {
  const { productId } = req.body;
  if (req.session.cart) {
    req.session.cart = req.session.cart.filter(item => item.id !== productId);
  }
  res.json({ message: 'Product removed from cart', cart: req.session.cart });
});

module.exports = router;
