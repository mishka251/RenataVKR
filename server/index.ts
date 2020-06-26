// содежимое index.js

// const db = require('./db.ts');
// const http = require('http');
// const port = 3000;
// const requestHandler = (request, response) => {
//     console.log(request.url);
//     //const patientName = 'Vasya';
//     // db(patientName)
//     //     .then((patient) => {
//     //         response.end('Hello Node.js Server! Patient=' + patient[0]._id);
//     //     })
//     //     .catch((error) => {
//     //         response.end('Hello Node.js Server! Error=' + error);
//     //     });
//     response.end('Hello Node.js Server!');
// };
// const server = http.createServer(requestHandler);
// server.listen(port, (err) => {
//     if (err) {
//         return console.log('something bad happened', err);
//     }
//     console.log(`server is listening on ${port}`);
// });

import path from 'path';
import express from 'express';

const app = express();
const DIST_DIR = __dirname;
const HTML_FILE = path.join(DIST_DIR, '../templates/меню.html');
const bundleDir = path.join(DIST_DIR, "../dist");
const staticDir = path.join(DIST_DIR, "../static");

app.use(express.static(bundleDir));
app.use(express.static(staticDir));

app.get('/', (req, res) => {
    res.sendFile(HTML_FILE);
});

app.get('/calculate/', (req, res) => {

});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`);
    console.log('Press Ctrl+C to quit.');
});