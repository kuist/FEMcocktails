const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

router.get('/', (req, res) => {
  if (!req.session.cart || req.session.cart.length === 0) {
    return res.redirect('/cart');
  }
  res.render('checkout', { title: 'Checkout', cart: req.session.cart });
});

router.post('/process', async (req, res) => {
  if (!req.session.cart || req.session.cart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const { token, address } = req.body;
  const amount = req.session.cart.reduce((total, item) => total + item.price * item.quantity, 0);

  try {
    const charge = await stripe.charges.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: 'usd',
      source: token,
      description: 'FemCocktails order'
    });

    const order = await Order.create({
      userId: req.session.userId,
      total: amount,
      status: 'paid',
      items: req.session.cart,
      shippingAddress: address
    });

    req.session.cart = []; // Clear the cart after successful order
    res.json({ message: 'Payment successful', orderId: order.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment failed' });
  }
});

module.exports = router;