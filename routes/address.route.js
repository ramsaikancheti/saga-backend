const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address.controller');

router.post('/addAddress/:userId', addressController.addAddress);
router.get('/getUserAddress/:userId/:cart?', addressController.getUserAddress);

module.exports = router;