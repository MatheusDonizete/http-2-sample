'use strict';

const spdy = require('spdy');
const fs = require('fs');
const express = require('express');
const app = express();
const options = {
    key: fs.readFileSync(`${__dirname}/server.key`),
    cert: fs.readFileSync(`${__dirname}/server.crt`)
};

const server = spdy.createServer(options, app);
app.get('/', (req, res) => {
    const pageHTML = fs.readFileSync(`${__dirname}/static/index.html`);
    const jsOptions = {
        status: 200, // opcional
        method: 'GET', // opcional
        request: {
            accept: '*/*'
        },
        response: {
            'content-type': 'application/javascript'
        }
    };

    let stream = res.push(`/app.js`, jsOptions);
    let materializeStream = res.push('/plugins/materialize.min.js', jsOptions);
    let materializeCssStream = res.push('/styles/plugins/materialize.min.css', {
        request: {
            accept: '*/*'
        },
        response: {
            'content-type': 'text/css'
        }
    });

    stream.on('error', () => {});
    stream.write(`alert('HTTP/2 Server Push Habilitado :)');`); //Método write() mantém a resposta aberta
    stream.end(fs.readFileSync(`${__dirname}/static/js/app.js`)); // Método end() fecha automaticamente a conexão
    materializeStream.write(fs.readFileSync(`${__dirname}/node_modules/jquery/dist/jquery.min.js`));
    materializeStream.end(fs.readFileSync(`${__dirname}/node_modules/materialize-css/dist/js/materialize.min.js`));
    materializeCssStream.end(fs.readFileSync(`${__dirname}/node_modules/materialize-css/dist/css/materialize.min.css`));
    res.set('Content-Type', 'text/html');
    res.send(new Buffer(pageHTML));
});

app.use(`/styles/fonts`, express.static(`${__dirname}/static/fonts`));
app.use(express.static(`${__dirname}/static`));

server.listen(process.env.PORT || 443, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log(`Listening at: https://${host}:${port}`);
});