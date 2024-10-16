const express = require('express');
const router = express.Router();
const productModel = require('../models/productModel');
const upload = require('../config/multer');
const { isAuthenticated, isSeller } = require('../middlewares/auth')
const { createProduct } = require('../controllers/productController')
router.use(isAuthenticated).use(isSeller)


router.post('/create-product', upload.any('image'), createProduct)


module.exports = router;