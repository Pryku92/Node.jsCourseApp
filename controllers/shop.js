const fs = require('fs');
const path = require('path');

const Product = require('../models/product');
const Order = require('../models/order');

const PDFGen = require('pdfkit');

const ITEMS_PER_PAGE = 1;

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
    const page = +req.query.page || 1;
    let totalItems;

    Product
        .find()
        .countDocuments()
        .then(numberOfProducts => {
            totalItems = numberOfProducts;
            return Product
                .find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;

    Product
        .find()
        .countDocuments()
        .then(numberOfProducts => {
            totalItems = numberOfProducts;
            return Product
                .find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Products',
                path: '/products',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
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
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            // console.log(products);
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products: products
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
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
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
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
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// // SEQUELIZE APPROACH
// exports.postOrder = (req, res, next) => {
//     let fetchedCart;
//     req.user
//         .getCart()
//         .then(cart => {
//             fetchedCart = cart;
//             return cart.getProducts();
//         })
//         .then(products => {
//             return req.user
//                 .createOrder()
//                 .then(order => {
//                     return order.addProducts(
//                         products.map(product => {
//                             product.orderItem = {qty: product.cartItem.qty};
//                             return product;
//                         })
//                     );
//                 })
//                 .catch(err => console.log(err));
//         })
//         .then(result => {
//             return fetchedCart.setProducts(null);
//         })
//         .then(result => {
//             res.redirect('/orders');
//         })
//         .catch(err => console.log(err));
// }

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return { qty: i.qty, product: {...i.productId._doc} };
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

// // SEQUELIZE APPROACH
// exports.getOrders = (req, res, next) => {
//     req.user
//         .getOrders({include: ['products']})
//         .then(orders => {
//             res.render('shop/orders', {
//                 pageTitle: 'Your Orders',
//                 path: '/orders',
//                 orders: orders
//             });
//         })
//         .catch(err => console.log(err));
// };

// // REGULAR MONGODB APPROACH
// exports.getOrders = (req, res, next) => {
//     req.user
//         .getOrders()
//         .then(orders => {
//             res.render('shop/orders', {
//                 pageTitle: 'Your Orders',
//                 path: '/orders',
//                 orders: orders
//             });
//         })
//         .catch(err => console.log(err));
// };

exports.getOrders = (req, res, next) => {
    Order.find({'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders: orders
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {
            if(!order) {
                return next(new Error('No order found.'));
            }
            if(order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized user'));
            }
            const invoiceName = 'invoice-' + orderId + '.pdf';
            const invoicePath = path.join('data', 'invoices', invoiceName);

            const pdf = new PDFGen();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
            pdf.pipe(fs.createWriteStream(invoicePath));
            pdf.pipe(res);

            pdf.fontSize(26).text('Invoice', {
                underline: true
            });
            pdf.text('------------------------');
            let totalPrice = 0;
            order.products.forEach(prod => {
                totalPrice += prod.qty * prod.product.price;
                pdf.fontSize(14).text(
                    `${prod.product.title} - ${prod.qty} x $${prod.product.price}`
                );
            });
            pdf.text('----')
            pdf.fontSize(20).text(`Total Price: $${totalPrice}`);

            pdf.end();

            // fs.readFile(invoicePath, (err, data) => {
            //     if(err) {
            //         return next(err);
            //     }
            //     res.setHeader('Content-Type', 'application/pdf');
            //     res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
            //     res.send(data);
            // });
            // const file = fs.createReadStream(invoicePath);
            // res.setHeader('Content-Type', 'application/pdf');
            // res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
            // file.pipe(res);
        })
        .catch(err => next(err));
};