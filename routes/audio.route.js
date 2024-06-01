
const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audio.controller');

router.post('/upload', audioController.uploadAudio);
router.get('/all', audioController.getAllAudio);


module.exports = router;
