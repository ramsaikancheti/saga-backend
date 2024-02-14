const express = require('express');
const orderController = require('../controllers/order.controller');

const router = express.Router();

router.get('/api/four-days-orders', orderController.getFourDaysOrders);

router.get('/all', orderController.getAllOrders);
router.post('/place/:userId', orderController.placeOrder);
router.get('/todaysorders', orderController.getTodaysOrders);
router.get('/yesterdaysorders', orderController.getYesterdaysOrders);
router.get('/thismonthorders', orderController.getThisMonthOrders);
router.get('/lastmonthorders', orderController.getLastMonthOrders);
router.get('/alltimesales', orderController.getAllTimeSales);

router.get('/api/totalproducts', orderController.getTotalProducts);
router.put('/updateorder/:orderId', orderController.updateOrderStatus);
router.put('/api/PaymentStatus/:orderId', orderController.updatepaymentStatus); 

router.get('/:orderId', orderController.getOrderById);

router.get('/api/users/data', orderController.getAllUsersData);

 

module.exports = router;
