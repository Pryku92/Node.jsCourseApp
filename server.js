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

//REQUEST BODY PARSER
app.use(bodyParser.urlencoded({extended: false}));

//STATIC SERVING OF FILES
app.use(express.static(path.join(__dirname, 'public')));

//ROUTING MIDDLEWARE
app.use('/admin', adminRoutes);
app.use(shopRoutes);

//PAGE NOT FOUND ROUTE
app.use(errorController.get404);

app.listen(8000);