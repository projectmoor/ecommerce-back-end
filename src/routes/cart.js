const express = require('express')
const router = express.Router()
// import Cart controllers
const { addItemToCart, getCartItems, removeCartItem } = require('../controller/cart')
// permission middleware
const { requireSignin, userMiddleware } = require('../common-middleware')

// request to add tiems to cart
router.post('/user/cart/addtocart', requireSignin, userMiddleware, addItemToCart)

router.post('/user/getCartItems', requireSignin, userMiddleware, getCartItems)

router.post('/user/cart/removeItem', requireSignin, userMiddleware, removeCartItem)

module.exports = router;