const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    galleryId: { type: Number, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
});

gallerySchema.pre('save', async function (next) {
    try {
        if (!this.isNew) {
            return next();
        }

        const lastGallery = await this.constructor.findOne({}, {}, { sort: { 'galleryId': -1 } });

        if (lastGallery && lastGallery.galleryId) {
            this.galleryId = lastGallery.galleryId + 1;
        } else {
            this.galleryId = 1;
        }

        this.image = "uploads/gallery/" + this.image;

        next();
    } catch (error) {
        console.error('Error generating galleryId:', error.message);
        next(error);
    }
});

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
