const path = require('path');

const express = require('express');

const root = require('../utility/path');

const router = express.Router();

const adminData = require('./admin');

router.get('/', (req, res, next) => {
    console.log('shop.js', adminData.products);
    res.sendFile(path.join(root, 'views', 'shop.html')); // __dirname, '../', 'views', 'shop.html'
});

module.exports = router;