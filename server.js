//NODE CORE MODULES IMPORTS
const path = require('path');

//3RD PARTY PACKAGES IMPORTS
const express = require('express');
const bodyParser = require('body-parser');

//EXPRESS INIT
const app = express();

//EXPRESS APP SETTINGS
app.set('view engine', 'pug');
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
    res.status(404).sendFile(path.join(__dirname, 'views', 'page-not-found.html'));
});

app.listen(8000);