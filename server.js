const http = require('http');

const express = require('express');

const core = express();

const server = http.createServer((req, res) => {core});

server.listen(8000);