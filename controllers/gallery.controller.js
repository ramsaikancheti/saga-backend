const Gallery = require('../models/gallery.model');

exports.createGallery = async (req, res) => {
    try {
        const { title, category } = req.body;
        const image = req.file.filename;

        const newGallery = new Gallery({
            title,
            category,
            image
        });

        await newGallery.save();

        res.status(201).json({ success: true, message: 'added to gallery successfully' });
    } catch (error) {
        console.error('Error creating gallery entry:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.getGalleryData = async (req, res) => {
    try {
        const galleryData = await Gallery.find();
        res.status(200).json(galleryData);
    } catch (error) {
        console.error('Error fetching gallery data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getGalleryById = async (req, res) => {
    const { galleryId } = req.params;

    try {
        const gallery = await Gallery.findOne({ galleryId });
        if (!gallery) {
            return res.status(404).json({ error: 'Gallery not found' });
        }
        res.status(200).json(gallery);
    } catch (error) {
        console.error('Error fetching gallery by ID:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.getImagesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const images = await Gallery.find({ category });
        res.json(images);
    } catch (error) {
        console.error('Error fetching images by category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getImageCountByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        let query = {};

        if (category && category.toLowerCase() !== 'all') {
            query = { category };
        }

        const imageCount = await Gallery.countDocuments(query);

        if (!imageCount) {
            return res.status(404).json({ error: 'No images found for the specified category' });
        }

        res.status(200).json({ category: category || 'all', count: imageCount });
    } catch (error) {
        console.error('Error fetching image count by category:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
