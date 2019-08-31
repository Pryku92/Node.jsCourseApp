//NODE CORE MODULES IMPORTS
const path = require('path');

//3RD PARTY PACKAGES IMPORTS
const express = require('express');
const bodyParser = require('body-parser');
//const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const SessionStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

//EXPRESS INIT
const app = express();

//SESSION STORE INIT
const store = new SessionStore({
    uri: 'mongodb+srv://ApkaNode:MDI4uEUrYLcinXKK@cluster0-3zw3b.mongodb.net/shop?retryWrites=true&w=majority',
    collection: 'sessions'
});

// CSRF PROTECTION INIT
const csrfProtection = csrf();

//EXPRESS APP SETTINGS

//Used for handlebars engine
// app.engine('hbs', expressHandlebars({
//     layoutsDir: 'views/layouts/',
//     defaultLayout: 'main-layout',
//     extname: 'hbs'
// }));

app.set('view engine', 'ejs');
app.set('views', 'views');

//ROUTERS IMPORTS
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/authentication');

//CONTROLLERS IMPORTS
const errorController = require('./controllers/error');

// //INITIALIZED SEQUELIZE OBJECT IMPORT
// const sequelize = require('./utility/database');

//MONGO CLIENT OBJECT IMPORT
//const mongoConnect = require('./utility/database').mongoConnect;

//MONGOOSE IMPORT
const mongoose = require('mongoose');

//MODELS IMPORTS
// const Product = require('./models/product');
const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

//REQUEST BODY PARSER
app.use(bodyParser.urlencoded({extended: false}));

//STATIC SERVING OF FILES
app.use(express.static(path.join(__dirname, 'public')));

//SESSION MIDDLEWARE
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use(csrfProtection);

// app.use((req, res, next) => {
//     //SEQUELIZE APPROACH
//     // User.findByPk(1)
//     //     .then(user => {
//     //         // IT'S POSSIBLE TO SAVE SOME VALUE IN REQUEST BODY
//     //         req.user = user;
//     //         next();
//     //     })
//     //     .catch(err => console.log(err));
//     User.findById('5d5ff3a5d2eeba0350d64613')
//         .then(user => {
//             req.user = user;
//             next();
//         })
//         .catch(err => console.log(err));
//     // next();
// });

// ASSIGNS FULL USER OBJECT FROM DATABASE BASED ON SESSION USER OBJECT
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

//LOCAL VARIABLES MIDDLEWARE (FOR RENDERED VIEWS)
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.csrfToken = req.csrfToken();
    next();
});

//ROUTING MIDDLEWARE
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

//PAGE NOT FOUND ROUTE
app.use(errorController.get404);

mongoose    
    .connect('mongodb+srv://ApkaNode:MDI4uEUrYLcinXKK@cluster0-3zw3b.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        // NOT NEEDED AFTER ADDING AUTHENTICATION
        // User.findOne().then(user => {
        //     if(!user) {
        //         const user = new User({
        //             name: 'John',
        //             email: 'john@test.com',
        //             cart: {
        //                 items: []
        //             }
        //         });
        //         user.save();
        //     }
        // });
        app.listen(8000);
    })
    .catch(err => console.log(err));

// mongoConnect(() => {
//     app.listen(8000);
// });


//SEQUELIZE APPROACH
// Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });

// sequelize
//     // .sync({ force: true })
//     .sync()
//     .then(result => {
//         return User.findByPk(1);
//     })
//     .then(user => {
//         if(!user) {
//             return User.create({ name: 'John', email: 'john@test.com' });
//         }
//         // INSTA RESOLVING PROMISE - not needed in .then block
//         // return Promise.resolve(user);
//         return user;
//     })
//     .then(user => {
//         return user.getCart()
//             .then(cart => {
//                 if(!cart) {
//                     return user.createCart();
//                 }
//             });
//     })
//     .then(cart => {
//         app.listen(8000);
//     })
//     .catch(err => {
//         console.log(err);
//     });