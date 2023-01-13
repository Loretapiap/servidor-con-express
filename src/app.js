const express = require('express');
const ProductManager = require('./ProductManager');
const app = express()

const productos = new ProductManager("productos.json");

// Consulta para obtener productos
app.get('/products', (req, res) => {
  let limit = req.query.limit;
  // Si se asigna el parametros ?limit= entonces, devuelve solo la cantidad indicada
  if (limit) {
    // Sin embargo, solo acepta valores numericos, de lo contrario arroja error
    if (!isNaN(limit)) {
      productos.getProducts(limit).then(result => res.json(result));
    } else {
      res.json({ Error: 'Valor ingresado no es un número' })
    }
  } else {
    productos.getProducts().then(result => res.json(result));
  }
});

//Consultar producto por id
app.get('/products/:pid', (req, res) => {
  const productId = req.params.pid;
  productos.getProductById(productId).then(result => res.json(result));
});

app.listen(8081, () => console.log('servido arriba!'));