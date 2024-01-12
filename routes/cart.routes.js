const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.post('/addToCart', cartController.addToCart);
router.get('/api/getcart', cartController.getAllCarts);
router.get('/api/getcart/:cartId', cartController.getCartById);
router.get('/getCart/userId/:userId', cartController.getUserCart);

module.exports = router;
