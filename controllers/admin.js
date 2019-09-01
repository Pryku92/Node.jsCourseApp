const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    //res.sendFile(path.join(root, 'views', 'add-product.html')); //__dirname, '..', 'views', 'add-product.html'
    // MANUAL ROUTE PROTECTION
    // if (!req.session.isAuthenticated) {
    //     return res.redirect('/login');
    // }
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    // REGULAR SQL ASSOCIATED CODE
    // const product = new Product(null, title, imageUrl, description, price);
    // product.save()
    //     .then(() => {
    //         res.redirect('/');
    //     })
    //     .catch(err => console.log(err));

    // //explicitly setting userId value
    // Product.create({
    //     title: title,
    //     price: price,
    //     imageUrl: imageUrl,
    //     description: description,
    //     //sequelize generated field for relation with Product
    //     userId: req.user.id
    // })

    //automatically setting userId value with sequelize method
    // req.user.createProduct({
    //     title: title,
    //     price: price,
    //     imageUrl: imageUrl,
    //     description: description
    // })
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });
        product
        .save()
        .then(result => {
            // console.log(result);
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    // //SEARCH THROUGH ALL PRODUCTS
    // Product.findByPk(prodId)
    // //ALTERNATIVE APPROACH
    // req.user
    //     .getProducts({ where: { id: prodId } })
        Product
        .findById(prodId)
        .then(product => {
            // const product = products[0];
            if(!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '',
                editing: editMode,
                product: product
            });
        })
        .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    // OLD WAY WITH FILE STORAGE
    // const updatedProduct = new Product(
    //     prodId,
    //     updatedTitle,
    //     updatedImageUrl,
    //     updatedDescription,
    //     updatedPrice
    // );
    // updatedProduct.save();
    //SEQUELIZE APPROACH
    // Product.findByPk(prodId)
    //     .then(product => {
    //         product.title = updatedTitle;
    //         product.price = updatedPrice;
    //         product.description = updatedDescription;
    //         product.imageUrl = updatedImageUrl;
    //         return product.save();
    //     })
    // // REGULAR MONGODB APPROACH
    // const product = new Product(
    //     updatedTitle,
    //     updatedPrice,
    //     updatedDescription,
    //     updatedImageUrl,
    //     prodId
    //     );

    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            product.imageUrl = updatedImageUrl;
            return product.save()
        })
        .then(result => {
            console.log('PRODUCT UPDATED');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProducts = (req, res, next) => {
    // 
    Product
        //.fetchAll()
        .find()
        .then(products => {
            res.render('admin/product-list', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    // FILE STORAGE APPROACH
    // Product.deleteById(prodId);
    // // SEQUELIZE APPROACH
    // Product.findByPk(prodId)
    //     .then(product => product.destroy())
    Product
        //.deleteById(prodId)
        .findByIdAndDelete(prodId)
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};