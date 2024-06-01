// safe.route.js

const express = require('express');
const router = express.Router();
const safeController = require('../controllers/safe.controller');

router.post('/register', safeController.registerSafeUser);
router.post('/login', safeController.loginSafeUser);


module.exports = router;
