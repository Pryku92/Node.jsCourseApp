
const fs = require('fs');

const routing = (req, res) => {
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
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            fs.writeFile('message.txt', message, (error) => {
                res.statusCode=302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
        //res.writeHead(statusCode, object with headers and values);
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My first node page</title></head>');
    res.write('<body><h1>Hello from Node.js</h1></body>');
    res.write('</body>');
    res.end();
};

module.exports = routing;