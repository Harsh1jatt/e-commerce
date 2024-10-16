const express = require('express');
const router = express.Router();
const {signup, signin, logout, getProfile, getProducts, getProductById, verifyPayment, createOrder} = require('../controllers/userController');
const {isAuthenticated, isSeller} = require('../middlewares/auth')

router.post('/signup', signup)
router.post('/login', signin)
router.get('/logout',isAuthenticated, logout)
router.get('/profile', isAuthenticated, getProfile)


router.get('/products', isAuthenticated, getProducts)
router.get('/product/:id', isAuthenticated, getProductById)
router.get('/order/:id', isAuthenticated, createOrder)
router.get('/verify/:id', isAuthenticated, verifyPayment)
module.exports = router;