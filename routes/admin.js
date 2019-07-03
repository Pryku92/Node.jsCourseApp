const path = require('path');

const express = require('express');

const root = require('../utility/path');

const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(root, 'views', 'add-product.html')); //__dirname, '..', 'views', 'add-product.html'
});

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
    products.push( {title: req.body.title} );
    res.redirect('/');
});

exports.router = router;
exports.products = products;