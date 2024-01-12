const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    cartId: { type: Number, required: true },
    products: { type: mongoose.Schema.Types.Mixed, default: [] },
});

const Cart = mongoose.model('Cart', cartSchema);

const findAndIncrementCartId = async () => {
    const highestCart = await Cart.findOne().sort({ cartId: -1 });
    const nextCartId = highestCart ? highestCart.cartId + 1 : 1;
    return nextCartId;
};

module.exports = { Cart, findAndIncrementCartId };



 