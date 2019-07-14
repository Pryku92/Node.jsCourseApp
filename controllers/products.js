const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    //res.sendFile(path.join(root, 'views', 'add-product.html')); //__dirname, '..', 'views', 'add-product.html'
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        activeShop: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    // console.log('shop.js', adminData.products);
    // res.sendFile(path.join(root, 'views', 'shop.html')); // __dirname, '../', 'views', 'shop.html'
    const products = Product.fetchAll();
    res.render('shop', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        activeAddProduct: false,
        productCSS: true
    });
};