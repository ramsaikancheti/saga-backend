const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
    categoryId: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String },
    status: { type: Number, default: 1 }, 
    types: [
        {
            typesId: { type: Number, required: true },
            name: { type: String, required: true },
            status: { type: Number, default: 1 },
            sizes: [
                {
                    sizeId: { type: Number }, 
                    name: { type: String },
                    description: { type: String },
                    symbol: { type: String },
                    status: { type: Number  },
                },
            ],
            image: { type: String },
        },
    ],
}, { strict: false });  

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;