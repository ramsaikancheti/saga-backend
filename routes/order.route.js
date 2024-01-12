const express = require('express');
const orderController = require('../controllers/order.controller');

const router = express.Router();

 router.get('/all', orderController.getAllOrders);
router.post('/place/:userId', orderController.placeOrder);

module.exports = router;
