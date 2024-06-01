const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller');

router.post('/upload', videoController.uploadVideo);
router.get('/get', videoController.getAllVideos); 
router.get('/:videoId', videoController.getVideoById);
module.exports = router;