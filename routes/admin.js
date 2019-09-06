//const path = require('path');

const express = require('express');
const { body } = require('express-validator/check');

//const root = require('../utility/path');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//app.use / app.post / app.get - HTTP method filtering (.get, .post etc. - exact matching)

router.use(isAuth);

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', [
    body('title')
        .isString()
        .isLength({min: 3})
        .trim(),
    body('imageUrl')
        .isURL(),
    body('price')
        .isFloat(),
    body('description')
        .isLength({min: 5, max: 300})
        .trim()
], adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', [
    body('title')
        .isString()
        .isLength({min: 3})
        .trim(),
    body('imageUrl')
        .isURL(),
    body('price')
        .isFloat(),
    body('description')
        .isLength({min: 5, max: 300})
        .trim()
], adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;