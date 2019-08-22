const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    // console.log('shop.js', adminData.products);
    // res.sendFile(path.join(root, 'views', 'shop.html')); // __dirname, '../', 'views', 'shop.html'
    // Product.fetchAll()
    //     .then(([rows]) => {
    //         res.render('shop/index', {
    //             prods: rows,
    //             pageTitle: 'Shop',
    //             path: '/'
    //         });
    //     })
    //     .catch(err => console.log(err));
    Product.fetchAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    // SEQUELIZE
    // Product.findAll({ where: { id: prodId } })
    //     .then(products => {
    //         res.render('shop/product-details', {
    //             product: products[0],
    //             pageTitle: products[0].title,
    //             path: '/products'
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
    // ALTERNATIVE SEQUELIZE APPROACH
    // Product.findByPk(prodId)
    //     .then(product => {
    //         res.render('shop/product-details', {
    //             product: product,
    //             pageTitle: product.title,
    //             path: '/products'
    //         });
    //     })
    //     .catch(err => console.log(err));
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-details', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

// // SEQUELIZE APPROACH
// exports.getCart = (req, res, next) => {
//     req.user
//         .getCart()
//         .then(cart => {
//             return cart
//                 .getProducts()
//                 .then(products => {
//                     res.render('shop/cart', {
//                         pageTitle: 'Your Cart',
//                         path: '/cart',
//                         products: products
//                     });
//                 })
//                 .catch(err => console.log(err));
//         })
//         .catch(err => console.log(err));
// };

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(products => {
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products: products
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    // Product.findById(prodId, product => {
    //     Cart.addProduct(prodId, product.price);
    // });
    // res.redirect('/cart');
    // // SEQUELIZE APPROACH
    // let fetchedCart;
    // let newQty = 1;
    // req.user
    //     .getCart()
    //     .then(cart => {
    //         fetchedCart = cart;
    //         return cart.getProducts({ where: { id: prodId } });
    //     })
    //     .then(products => {
    //         let product;
    //         if(products.length > 0) {
    //             product = products[0];
    //         }
    //         if(product) {
    //             const oldQty = product.cartItem.qty;
    //             newQty = oldQty + 1;
    //             return product;
    //         }
    //         return Product.findByPk(prodId)
    //     })
    //     .then(product => {
    //         return fetchedCart.addProduct(product, {
    //             through: { qty: newQty }
    //         });
    //     })
    //     .then(() => {
    //         res.redirect('/cart');
    //     })
    //     .catch(err => console.log(err));
    Product.findById(prodId)
        .then(product => {
            req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

// // SEQUELIZE APPROACH
// exports.postCartDeleteItem = (req, res, next) => {
//     const prodId = req.body.productId;
//     req.user
//         .getCart()
//         .then(cart => {
//             return cart.getProducts( {where: {id: prodId} });
//         })
//         .then(products => {
//             const product = products[0];
//             return product.cartItem.destroy();
//         })
//         .then(result => {
//             res.redirect('/cart');
//         })
//         .catch(err => console.log(err));
// };

exports.postCartDeleteItem = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .deleteCartItem(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user
                .createOrder()
                .then(order => {
                    return order.addProducts(
                        products.map(product => {
                            product.orderItem = {qty: product.cartItem.qty};
                            return product;
                        })
                    );
                })
                .catch(err => console.log(err));
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({include: ['products']})
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};