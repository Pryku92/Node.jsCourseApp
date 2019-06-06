const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    //process.exit();
    const url = req.url;
    const method =req.method;
    if(url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Submit</button></form></body>');
        res.write('</html>');
        return res.end();
    }
    if(url === '/message' && method === 'POST') {
        fs.writeFileSync('message.txt', 'DUMMY');
        //res.writeHead(statusCode, object with headers and values);
        res.statusCode=302;
        res.setHeader('Location', '/');
        return res.end();
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My first node page</title></head>');
    res.write('<body><h1>Hello from Node.js</h1></body>');
    res.write('</body>');
    res.end();
});

server.listen(8000);