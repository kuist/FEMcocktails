const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { isAdmin } = require('../middleware/auth');

router.use(isAdmin);

router.get('/products', async (req, res) => {
  const products = await Product.findAll();
  res.render('admin/products', { title: 'Manage Products', products });
});

router.get('/products/add', (req, res) => {
  res.render('admin/addProduct', { title: 'Add Product' });
});

router.post('/products/add', async (req, res) => {
  const { name, description, price, image } = req.body;
  try {
    await Product.create({ name, description, price, image });
    res.redirect('/admin/products');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Failed to add product' });
  }
});

router.get('/products/edit/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  res.render('admin/editProduct', { title: 'Edit Product', product });
});

router.post('/products/edit/:id', async (req, res) => {
  const { name, description, price, image } = req.body;
  try {
    await Product.update({ name, description, price, image }, { where: { id: req.params.id } });
    res.redirect('/admin/products');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Failed to update product' });
  }
});

router.post('/products/delete/:id', async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.redirect('/admin/products');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Failed to delete product' });
  }
});

module.exports = router;