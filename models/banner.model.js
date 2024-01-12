const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    bannerId: { type: Number, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String }, 
    image: { type: String, required: true },
 });

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;