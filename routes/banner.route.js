const express = require('express');
const router = express.Router();
const multer = require('multer');
const bannerController = require('../controllers/banner.controller'); 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

router.get('/getAllBanners', bannerController.getAllBanners);
router.post('/addBanner', upload.single('image'), (req, res) => {
    bannerController.addBanner(req, res);
});

module.exports = router;


