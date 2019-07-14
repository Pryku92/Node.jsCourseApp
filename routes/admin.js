const path = require('path');

const express = require('express');

//const root = require('../utility/path');
const productsController = require('../controllers/products');

const router = express.Router();

//app.use / app.post / app.get - HTTP method filtering (.get, .post etc. - exact matching)

// /admin/add-product => GET
router.get('/add-product', productsController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', productsController.postAddProduct);

module.exports = router;