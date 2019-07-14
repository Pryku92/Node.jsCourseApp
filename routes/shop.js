const path = require('path');

const express = require('express');

//const root = require('../utility/path');
const productsController = require('../controllers/products');

const router = express.Router();

router.get('/', productsController.getProducts);

module.exports = router;