const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: String,
    user: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'User',
    },
    couponCode: String,
    discount: Number,
    totalAmount: Number,
    payments: {
      paymentId: Number,
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
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        brandname: String,
        description: String,
        price: Number,
        category: {
          categoryId: Number,
          name: String,
          image: String,
        },
        type: {
          typesId: Number,
          name: String,
          image: String,
        },
        sizes: [
          {
            sizeId: Number,
            name: String,
            description: String,
            symbol: String,
          },
        ],
        images: [String],
        quantity: Number,
      },
    ],
  },
  {
    timestamps: {
      currentTime: () => new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
      createdAt: 'created_at', 
    },
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

