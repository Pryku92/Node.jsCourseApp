const http = require('http');
const routes = require('./routes');

const server = http.createServer((req, res) => {
    //process.exit();
    routes(req, res);
});

server.listen(8000);