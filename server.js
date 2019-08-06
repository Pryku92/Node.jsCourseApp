//NODE CORE MODULES IMPORTS
const path = require('path');

//3RD PARTY PACKAGES IMPORTS
const express = require('express');
const bodyParser = require('body-parser');
//const expressHandlebars = require('express-handlebars');

//EXPRESS INIT
const app = express();

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

//CONTROLLERS IMPORTS
const errorController = require('./controllers/error');

//INITIALIZED SEQUELIZE OBJECT IMPORT
const sequelize = require('./utility/database');

//MODELS IMPORTS
const Product = require('./models/product');
const User = require('./models/user');

//REQUEST BODY PARSER
app.use(bodyParser.urlencoded({extended: false}));

//STATIC SERVING OF FILES
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            // IT'S POSSIBLE TO SAVE SOME VALUE IN REQUEST BODY
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

//ROUTING MIDDLEWARE
app.use('/admin', adminRoutes);
app.use(shopRoutes);

//PAGE NOT FOUND ROUTE
app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize
    // .sync({ force: true })
    .sync()
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if(!user) {
            return User.create({ name: 'John', email: 'john@test.com' });
        }
        // INSTA RESOLVING PROMISE - not needed in .then block
        // return Promise.resolve(user);
        return user;
    })
    .then(user => {
        app.listen(8000);
    })
    .catch(err => {
        console.log(err);
    });