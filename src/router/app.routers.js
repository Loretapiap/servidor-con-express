const express = require('express');
const { Router } = require('express');
const ProductRoute = require('./products.js');
const CartRoute = require('./carts.js');


const router = Router();

router.use("/products", ProductRoute);
// router.use("/carts", CartRoute);


router.use((err, req, res, next) => {
  res.status(500).json({
    status: "error",
    error: err.message
  })
});

module.exports = router;