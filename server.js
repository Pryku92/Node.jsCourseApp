const http = require('http');

const express = require('express');

const core = express();

core.use((req, res, next) => {
    console.log('In the middleware!');
    next();
});

core.use((req, res, next) => {
    console.log('In another middleware!');
    res.send('<h1>Hello from Express!</h1>')
});

const server = http.createServer(core);

server.listen(8000);