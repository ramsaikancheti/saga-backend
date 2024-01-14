const express = require('express');
const router = express.Router(); 

const userController = require('../controllers/user.controller');
const { loginUser } = require('../controllers/user.controller');


router.post('/register', userController.registerUser);
// router.post('/login', userController.loginUser);
router.post('/login', loginUser);


module.exports = router;
