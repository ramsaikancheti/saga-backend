const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        orderId: String,
        status: { type: Number, default: 1 }, 
        user: {
            type: mongoose.Schema.Types.Mixed,
            ref: 'User',
        },
        couponCode: String,
        discount: Number,
        totalAmount: Number,
        payments: {
            paymentId: Number,
            status: { type: Number, default: 1 }, 
            name: String,
            image: String,
        },
        address: {
            addressId: Number,
            hNo: String,
            area: String,
            city: String,
            state: String,
            pincode: String,
        },
        products: [
            {
                type: mongoose.Schema.Types.Mixed,
                ref: 'Product',
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: {
            currentTime: () => new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
            createdAt: 'created_at',
        },
    }
);

orderSchema.index({ createdAt: 1 }); 

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
