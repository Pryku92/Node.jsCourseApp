const path = require('path');

const express = require('express');

const root = require('../utility/path');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.sendFile(path.join(root, 'views', 'shop.html')); // __dirname, '../', 'views', 'shop.html'
});

module.exports = router;