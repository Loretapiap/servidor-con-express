require('dotenv').config();
const express = require('express');
const AppRouters = require('./router/app.routers');

const ProductManager = require('./ProductManager');
const app = express()

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use( '/api', AppRouters);

const server = app.listen(PORT, () => console.log('servidor arriba!'));
server.on("error", err => console.log(err));
