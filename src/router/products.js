const { Router } = require('express');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});

const Uploader = multer({ storage });

const router = Router();

const ProductManager = require('../ProductManager');
const productos = new ProductManager('./src/productos.json');

// Obtener productos 
router.get('/', async (req, res) => {
  let { limit } = req.query;
  if (limit) {
    if (!isNaN(limit)) {
      productos.getProducts(limit).then(result => res.json(result));
    } else {
      res.json({ Error: 'Valor ingresado no es un número' })
    }
  } else {
    productos.getProducts().then(result => res.json(result));
  }
});

// Buscar por id
router.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  productos.getProductById(pid).then(result => res.json(result));
})

router.post('/', Uploader.array('thumbnails'), async (req, res) => {
  const item = req.body;
  let thumbnails = req.files ? (req.files.map(file => `/img/${file.originalname}`)) : [];

  let { title, description, price, code, category, stock } = item;
  if (title && description && price && code && category && stock) {
    const status = item.status ? item.status : true;

    const product = await productos.addProduct({ ...req.body, status: status, thumbnail: thumbnails });

    if (product.status === 'error') {
      return res.status(404).json({
        ...product
      })
    }

    return res.status(201).json({
      status: "success",
      data: product
    })
  } else {
    return res.status(400).json({
      status: "error",
      error: `Información incompleta`
    })
  }
})


router.put('/:pid', async (req, res) => {
  const { pid } = req.params;

  try {
    const product = await productos.updateProduct(Number(pid), req.body);
    return res.status(200).json({
      status: "success",
      data: product
    });
  } catch (error) {
    if (error.status === 'error') {
      return res.status(404).json({
        status: "error",
        error: error.message
      });
    }
    return res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});



router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;

  const product = await productos.deleteProduct(Number(pid));

  if (product.code !== 200) {
    return res.json({
      ...product
    })
  }
})



module.exports = router;