'use strict';

const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);

app.use(`/`, express.static(`${__dirname}/static`));
app.use(`/styles/fonts`, express.static(`${__dirname}/node_modules/materialize-css/fonts`));
app.use(`/app.js`, express.static(`${__dirname}/static/js/app.js`));
app.use(`/jquery.js`, express.static(`${__dirname}/node_modules/jquery/dist/jquery.min.js`));
app.use(`/plugins/materialize.min.js`, express.static(`${__dirname}/node_modules/materialize-css/dist/js/materialize.min.js`));
app.use(`/styles/plugins/materialize.min.css`, express.static(`${__dirname}/node_modules/materialize-css/dist/css/materialize.min.css`));

server.listen(1337, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log(`Listening at: https://${host}:${port}`);
});