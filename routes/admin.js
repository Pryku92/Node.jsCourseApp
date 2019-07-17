const path = require('path');

const express = require('express');

//const root = require('../utility/path');
const adminController = require('../controllers/admin');

const router = express.Router();

//app.use / app.post / app.get - HTTP method filtering (.get, .post etc. - exact matching)

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/add-product => GET
router.get('/products');

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

module.exports = router;