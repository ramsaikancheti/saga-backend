const mongoose = require('mongoose');
const Order = require('../models/order.model');
 const { Cart } = require('../models/cart.model');
const { User } = require('../models/user.models');
const { Address } = require('../models/address.model');
const Product = require('../models/product.model');
const Payment = require('../models/payment.Model');
const { v4: uuidv4 } = require('uuid');

async function placeOrder(req, res) {
    try {
        const userId = parseInt(req.params.userId);
        const { couponCode, discount, paymentMethod, addressId } = req.body;

        const userCart = await Cart.findOne({ userId });

        if (!userCart || userCart.products.length === 0) {
            return res.status(400).json({ success: false, message: 'User cart is empty. Add products to the cart before placing an order.' });
        }

        const shippingCost = calculateShippingCost(userCart.products);
        const totalAmount = calculateTotalAmount(userCart.products, discount) + shippingCost;
        const orderId = generateRandomOrderId();

        const addressDetails = await Address.findOne({ userId, addressId });

        if (!addressDetails) {
            return res.status(404).json({ success: false, message: 'Address not found for the given addressId.' });
        }

        const userDetails = await User.findOne({ userId });

        if (!userDetails) {
            return res.status(404).json({ success: false, message: 'User not found for the given userId.' });
        }

        const paymentDetails = await Payment.findOne({ paymentId: paymentMethod });

        if (!paymentDetails) {
            return res.status(404).json({ success: false, message: 'Payment method not found for the given paymentId.' });
        }

        const orderProducts = userCart.products.map((product) => {
            return {
                productId: product._id, 
                name: product.name,
                brandname: product.brandname,
                description: product.description,
                price: product.price,
                category: product.category, 
                type: product.type, 
                sizes: product.sizes, 
                images: product.images,
                quantity: product.quantity,
            };
        });

        const newOrder = new Order({
            orderId,
            user: userDetails.toObject(),
            couponCode,
            discount,
            totalAmount,
            payments: paymentDetails.toObject(),
            address: {
                hNo: addressDetails.hNo,
                area: addressDetails.area,
                city: addressDetails.city,
                state: addressDetails.state,
                pincode: addressDetails.pincode,
            },
            products: orderProducts,
        });

        await newOrder.save();

        userCart.products = [];
        await userCart.save();

        res.json({ success: true, message: 'Order placed successfully!', orderId });

    } catch (error) {
        console.error('Error placing order:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}


    function calculateTotalAmount(products, discount) {
    const subtotal = products.reduce((total, product) => total + product.price * product.quantity, 0);
    return subtotal - (subtotal * discount) / 100;
    }

    function calculateShippingCost(products) {
    const fixedShippingCost = 50;
    return fixedShippingCost;
    }

    function generateRandomOrderId() {
    return uuidv4().substr(0, 6).toUpperCase();
    }

    const getAllOrders = async (req, res) => {
        try {
            const orders = await Order.find();
            const totalOrders = await Order.countDocuments(); 
            res.json({ success: true, totalOrders, orders });
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    };
    

    const getOrderById = async (req, res) => {
        try {
            const orderId = req.params.orderId;
            const order = await Order.findOne({ orderId });
    
            if (!order) {
                return res.status(404).json({ success: false, message: 'Order not found' });
            }
    
            res.json({ success: true, order });
        } catch (error) {
            console.error('Error fetching order by orderId:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    };


    const getTodaysOrders = async (req, res) => {
        try {
            const today = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' });
            const startDate = new Date(today + ' 00:00:00');
            const endDate = new Date(today + ' 23:59:59');
    
            const todaysOrders = await Order.find({
                createdAt: { $gte: startDate, $lte: endDate },
                'payments.status': 1,
                status: { $ne: 4 },  
                $or: [
                    { 'payments.paymentId': { $ne: 4 } },
                    { $and: [{ 'payments.paymentId': 4 }, { status: 3 }] },
                ],
            });
    
            console.log('todaysOrders:', todaysOrders);
    
            const totalOrders = todaysOrders.length;
            const totalAmount = todaysOrders.reduce((total, order) => total + order.totalAmount, 0);
    
            const paymentTypeDetails = {};
    
            todaysOrders.forEach((order) => {
                const paymentType = order.payments.name;
                if (!paymentTypeDetails[paymentType]) {
                    paymentTypeDetails[paymentType] = {
                        count: 1,
                        totalAmount: order.totalAmount,
                    };
                } else {
                    paymentTypeDetails[paymentType].count += 1;
                    paymentTypeDetails[paymentType].totalAmount += order.totalAmount;
                }
            });
    
            res.json({
                success: true,
                totalOrders,
                totalAmount,
                paymentTypeDetails,
            });
        } catch (error) {
            console.error('Error fetching today\'s orders:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    };


    const getYesterdaysOrders = async (req, res) => {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const startDate = new Date(yesterday.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' }) + ' 00:00:00');
        const endDate = new Date(yesterday.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' }) + ' 23:59:59');

        const yesterdaysOrders = await Order.find({
            createdAt: { $gte: startDate, $lte: endDate },
            'payments.status': 1,
            status: { $ne: 4 }, 
            $or: [
                { 'payments.paymentId': { $ne: 4 } },
                { $and: [{ 'payments.paymentId': 4 }, { status: 3 }] },
            ],
        });

        console.log('yesterdaysOrders:', yesterdaysOrders);

        const totalOrders = yesterdaysOrders.length;
        const totalAmount = yesterdaysOrders.reduce((total, order) => total + order.totalAmount, 0);

        const paymentTypeDetails = {};

        yesterdaysOrders.forEach((order) => {
            const paymentType = order.payments.name;
            if (!paymentTypeDetails[paymentType]) {
                paymentTypeDetails[paymentType] = {
                    count: 1,
                    totalAmount: order.totalAmount,
                };
            } else {
                paymentTypeDetails[paymentType].count += 1;
                paymentTypeDetails[paymentType].totalAmount += order.totalAmount;
            }
        });

        res.json({
            success: true,
            totalOrders,
            totalAmount,
            paymentTypeDetails,
        });
    } catch (error) {
        console.error('Error fetching yesterday\'s orders:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
    
const getThisMonthOrders = async (req, res) => {
    try {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startDate = new Date(firstDayOfMonth.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' }) + ' 00:00:00');
        const endDate = now;

        const thisMonthOrders = await Order.find({
            createdAt: { $gte: startDate, $lte: endDate },
            'payments.status': 1,
            status: { $ne: 4 },  
            $or: [
                { 'payments.paymentId': { $ne: 4 } },
                { $and: [{ 'payments.paymentId': 4 }, { status: 3 }] },
            ],
        });

        console.log('thisMonthOrders:', thisMonthOrders);

        const totalOrders = thisMonthOrders.length;
        const totalAmount = thisMonthOrders.reduce((total, order) => total + order.totalAmount, 0);

        const paymentTypeDetails = {};

        thisMonthOrders.forEach((order) => {
            const paymentType = order.payments.name;
            if (!paymentTypeDetails[paymentType]) {
                paymentTypeDetails[paymentType] = {
                    count: 1,
                    totalAmount: order.totalAmount,
                };
            } else {
                paymentTypeDetails[paymentType].count += 1;
                paymentTypeDetails[paymentType].totalAmount += order.totalAmount;
            }
        });

        res.json({
            success: true,
            totalOrders,
            totalAmount,
            paymentTypeDetails,
        });
    } catch (error) {
        console.error('Error fetching this month\'s orders:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};



    const getLastMonthOrders = async (req, res) => {
        try {
            const now = new Date();
            const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            const startDate = new Date(firstDayOfLastMonth.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' }) + ' 00:00:00');
            const endDate = new Date(lastDayOfLastMonth.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' }) + ' 23:59:59');
    
            const lastMonthOrders = await Order.find({
                createdAt: { $gte: startDate, $lte: endDate }
            });
    
            console.log('lastMonthOrders:', lastMonthOrders);
    
            const totalOrders = lastMonthOrders.length;
            const totalAmount = lastMonthOrders.reduce((total, order) => total + order.totalAmount, 0);
    
            const paymentTypeDetails = {};
    
            lastMonthOrders.forEach((order) => {
                const paymentType = order.payments.name;  
                if (!paymentTypeDetails[paymentType]) {
                    paymentTypeDetails[paymentType] = {
                        count: 1,
                        totalAmount: order.totalAmount,
                    };
                } else {
                    paymentTypeDetails[paymentType].count += 1;
                    paymentTypeDetails[paymentType].totalAmount += order.totalAmount;
                }
            });
    
            res.json({
                success: true,
                totalOrders,
                totalAmount,
                paymentTypeDetails,
            });
        } catch (error) {
            console.error('Error fetching last month\'s orders:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    };
    
    const getAllTimeSales = async (req, res) => {
        try {
            const allTimeOrders = await Order.find({
                'payments.status': 1,
                'status': { $ne: 4 }  
            });
    
            const totalAmount = allTimeOrders.reduce((total, order) => {
                 if (order.payments.paymentId === 4 && order.status !== 3) {
                    return total;
                }
                return total + order.totalAmount;
            }, 0);
    
            res.json({
                success: true,
                totalAmount,
                totalOrders: allTimeOrders.length,
            });
        } catch (error) {
            console.error('Error fetching all-time sales:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }; 


    const getFourDaysOrders = async (req, res) => {
        try {
            const now = new Date();
            const startDate = new Date(now);
            startDate.setDate(now.getDate() - 4);  
    
            const fourDaysOrders = await Order.find({
                createdAt: { $gte: startDate, $lte: now }
            });
    
            const dateRange = [];
            for (let i = 0; i < 4; i++) {
                const date = new Date(now);
                date.setDate(now.getDate() - i);
                dateRange.push(date.toISOString().split('T')[0]);
            }
    
             dateRange.reverse(); 
    
            const ordersInfoMap = new Map();
    
             dateRange.forEach(dateKey => {
                ordersInfoMap.set(dateKey, {
                    date: dateKey,
                    totalAmount: 0,
                    totalOrders: 0,
                    paymentTypeDetails: {},
                });
            });
    
            fourDaysOrders.forEach(order => {
                const dateKey = order.createdAt.toISOString().split('T')[0];
            
                const dateInfo = ordersInfoMap.get(dateKey);
            
                 if (dateInfo) {
                    dateInfo.totalOrders += 1;
            
                    const paymentType = order.payments.name;
                    if (!dateInfo.paymentTypeDetails[paymentType]) {
                        dateInfo.paymentTypeDetails[paymentType] = {
                            count: 1,
                            totalAmount: order.totalAmount,
                        };
                    } else {
                        dateInfo.paymentTypeDetails[paymentType].count += 1;
                        dateInfo.paymentTypeDetails[paymentType].totalAmount += order.totalAmount;
                    }
                } else {
                    console.error('Error: dateInfo is undefined for order with dateKey:', dateKey);
                }
            });
            
    
            const ordersInfo = Array.from(ordersInfoMap.values());

            if (ordersInfo.length === 0) {
                res.json({
                    success: true,
                    totalOrders: 0,
                    totalAmount: 0,
                    orders: dateRange.map(date => ({
                        date,
                        totalOrders: 0,
                        paymentTypeDetails: {},
                    })),
                });
            } else {
                const totalOrders = ordersInfo.reduce((total, order) => total + order.totalOrders, 0);
                const totalAmount = ordersInfo.reduce((total, order) => total + order.totalAmount, 0);
    
                res.json({
                    success: true,
                    totalOrders,
                     orders: ordersInfo,
                });
            }
        } catch (error) {
            console.error('Error fetching four days\' orders:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }; 


    const getTotalProducts = async (req, res) => {
        try {
            const totalProducts = await Order.aggregate([
                {
                    $unwind: "$products"
                },
                {
                    $group: {
                        _id: {
                            productId: "$products.productId",
                            productName: "$products.name"
                        },
                        totalOrders: { $sum: 1 }
                    }
                },
                {
                    $sort: { totalOrders: -1 }
                },
                {
                    $limit: 4
                },
                {
                    $project: {
                        _id: 0,
                        productName: "$_id.productName",
                        totalOrders: 1
                    }
                }
            ]);
    
            res.json({ success: true, totalProducts });
        } catch (error) {
            console.error('Error fetching total products:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    };

    const updateOrderStatus = async (req, res) => {
        try {
            const orderId = req.params.orderId;
            const newStatus = req.body.status;
    
            console.log('Attempting to update order with orderId:', orderId);
    
            const existingOrder = await Order.findOne({ orderId: orderId });
    
            if (!existingOrder) {
                console.log('Order not found in the database.');
                return res.status(404).json({ error: 'Order not found' });
            }
    
            const result = await Order.findOneAndUpdate(
                { orderId: orderId },
                { $set: { status: newStatus } },
                { new: true }
            );
    
            console.log('Order updated successfully:', result);
    
            let message = '';
            if (newStatus === 1) {
                message = 'Order updated as processing';
            } else if (newStatus === 2) {
                message = 'Order updated as pending';
            } else if (newStatus === 3) {
                message = 'Order updated as delivered';
            } else if (newStatus === 4) {
                message = 'Order updated as canceled';
            }
    
            res.json({ message, order: result });

        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    };

    const updatepaymentStatus = async (req, res) => {
        try {
            const orderId = req.params.orderId;
            const newStatus = req.body.status;
    
             if (newStatus !== 0 && newStatus !== 1) {
                console.log('Invalid payment status value:', newStatus);
                return res.status(400).json({ error: 'Invalid payment status value' });
            }
    
            console.log('Attempting to update payment with orderId:', orderId);
    
            const result = await Order.findOneAndUpdate(
                { orderId: orderId },
                { $set: { 'payments.status': newStatus } },
                { new: true }
            );
    
            if (!result) {
                console.log('Order not found in the database.');
                return res.status(404).json({ error: 'Order not found' });
            }
    
            console.log('Order updated successfully:', result);
    
            let message = '';
            if (newStatus === 0) {
                message = 'Payment updated as unsuccessful';
            } else if (newStatus === 1) {
                message = 'Payment updated as successful';
            }
    
            res.json({ message, order: result });
    
        } catch (error) {
            console.error('Error updating payment status:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    };


    const getAllUsersData = async (req, res) => {
        try {
            const users = await User.find();
            const usersData = [];
    
            for (const user of users) {
                const totalOrders = await Order.countDocuments({ 'user._id': user._id });
    
                const userDetails = {
                    userId: user.userId,
                    userName: user.name,
                    userEmail: user.email,
                    userpassword: user.password,
                    totalOrders,
                };
    
                usersData.push(userDetails);
            }
    
            res.json({ success: true, usersData });
        } catch (error) {
            console.error('Error fetching users data:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    };
    
    
    
module.exports = { placeOrder, getAllOrders, getOrderById, getTodaysOrders, getYesterdaysOrders, getThisMonthOrders, getLastMonthOrders, getAllTimeSales, getFourDaysOrders, getTotalProducts, updateOrderStatus, updatepaymentStatus, getAllUsersData };