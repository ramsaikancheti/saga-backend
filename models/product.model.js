const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    brandname: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
        categoryId: { type: Number, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
    },
    type: {
        typesId: { type: Number, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
    },
    sizes: [{
        sizeId: { type: Number, required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        symbol: { type: String, required: true }
    }],

    images: [{ type: String, required: true }],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
