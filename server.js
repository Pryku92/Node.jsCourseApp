const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//app.use / app.post / app.get - HTTP method filtering

app.use(bodyParser.urlencoded({extended: false}));

app.use('/add-product', (req, res, next) => {
    res.send('<form action="/products" method="POST"><input type="text" name="title"><button type="submit">Send</button></form>')
});

app.use('/products', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

app.use('/', (req, res, next) => {
    res.send('<h1>Hello from Express!</h1>')
});

app.listen(8000);