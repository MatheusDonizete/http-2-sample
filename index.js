'use strict';

const spdy = require('spdy');
const fs = require('fs');
const app = require('express')();
const options = {
    key: fs.readFileSync(`${__dirname}/server.key`),
    cert: fs.readFileSync(`${__dirname}/server.crt`)
};
const server = spdy.createServer(options, app);

app.get('/', (req, res) => {
    const pageHTML = fs.readFileSync(`${__dirname}/static/index.html`);
    res.set('Content-Type', 'text/html');
    res.send(new Buffer(pageHTML));
});

server.listen(process.env.PORT || 443, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log(`Listening at: https://${host}:${port}`);
});