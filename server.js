//NODE CORE MODULES IMPORTS
const path = require('path');

//3RD PARTY PACKAGES IMPORTS
const express = require('express');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');

//EXPRESS INIT
const app = express();

//EXPRESS APP SETTINGS
app.engine('hbs', expressHandlebars({
    defaultLayout: null,
    extname: 'hbs'
}));
app.set('view engine', 'hbs');
app.set('views', 'views');

//ROUTERS IMPORTS
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//REQUEST BODY PARSER
app.use(bodyParser.urlencoded({extended: false}));

//STATIC SERVING OF FILES
app.use(express.static(path.join(__dirname, 'public')));

//ROUTING MIDDLEWARE
app.use('/admin', adminData.router);
app.use(shopRoutes);

//PAGE NOT FOUND ROUTE
app.use((req, res, next) => {
    //res.status(404).sendFile(path.join(__dirname, 'views', 'page-not-found.html'));
    res.status(404).render('page-not-found', {pageTitle: 'Page Not Found'});
});

app.listen(8000);