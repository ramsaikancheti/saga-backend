const mongoose = require('mongoose');
const Order = require('../models/order.model');
const { Cart } = require('../models/cart.model');
const User = require('../models/user.models');
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
            products: userCart.products.map(product => ({
                product: {
                    productId: product.productId,
                    name: product.name,
                    brandname: product.brandname,
                    description: product.description,
                    price: product.price,
                    category: {
                        categoryId: product.category.categoryId,
                        name: product.category.name,
                        image: product.category.image,
                    },
                    type: product.type ? {
                        typesId: product.type.typesId,
                        name: product.type.name,
                        image: product.type.image,
                    } : null,
                    sizes: product.sizes.map(size => ({
                        sizeId: size.sizeId,
                        name: size.name,
                        description: size.description,
                        symbol: size.symbol,
                    })),
                    images: product.images,
                    quantity: product.quantity,
                },
            })),
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

function getPaymentMethodName(paymentMethodNumber) {
  const paymentMethodMap = {
    1: 'netbanking',
    2: 'credit card',
    3: 'debit card',
    4: 'cash on delivery',
  };
  return paymentMethodMap[paymentMethodNumber] || 'unknown';
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = { placeOrder, getAllOrders };
