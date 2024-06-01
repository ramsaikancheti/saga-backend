const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const galleryController = require('../controllers/gallery.controller'); 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/gallery/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

const {
    createGallery,
    getGalleryData,
    getGalleryById,
    getImagesByCategory,
    getImageCountByCategory 
} = galleryController; 

router.post('/api/post/gallery', upload.single('image'), createGallery); 
router.get('/api/get/gallery', getGalleryData);
router.get('/api/get/gallerybyid/:galleryId', getGalleryById);
router.get('/api/category/:category', getImagesByCategory);
router.get('/api/categoryimg/:category', getImageCountByCategory);

module.exports = router;
