const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
// import Product data model
const Product = require('../models/product')
// import Product controllers
const { createProduct, getProductsBySlug, getProductDetailsById, deleteProductById, getProducts } = require('../controller/product')
// permission middleware
const { requireSignin, adminMiddleware } = require('../common-middleware')

const shortid = require('shortid')
// create a upload middleware
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), '../', 'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname)
    }
})
   
const upload = multer({ storage })

// request to create a new product
router.post('/product/create', requireSignin, adminMiddleware, upload.array('productPicture'), createProduct)

// request to get products in a category 
router.get('/products/:slug', getProductsBySlug)

router.get('/product/:productId', getProductDetailsById)

router.delete(
  "/product/deleteProductById",
  requireSignin,
  adminMiddleware,
  deleteProductById
);
router.post(
  "/product/getProducts",
  requireSignin,
  adminMiddleware,
  getProducts
);


module.exports = router;