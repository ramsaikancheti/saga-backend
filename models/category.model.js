const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
    categoryId: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String },
    types: [
        {
            typesId: { type: Number, required: true },
            name: { type: String, required: true },
            sizes: [
                {
                    sizeId: { type: Number, unique: true },
                    name: { type: String, required: true },
                    description: { type: String, required: true },
                    symbol: { type: String, required: true },
                },
            ],
            image: { type: String },
        },
    ],
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
