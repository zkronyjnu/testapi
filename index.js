require('dotenv').config({ path: __dirname + '/.env' });
require('./server/connection');

const express = require('express');
const body_parser = require('body-parser');
const path = require('path');
const cors = require('cors');
const port = process.env['PORT'];

const app = express();
var http = require('http').createServer(app);

let admin = require('./server/routes/admin');


app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(express.static(path.join(__dirname, 'server/views')));

app.use(process.env['API_V1'] + "admin", admin);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})


http.listen(port, () => {
    console.log(`server running on port ${port}`);
});