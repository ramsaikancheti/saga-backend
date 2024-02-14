const express = require('express');
const router = express.Router(); 

const userController = require('../controllers/user.controller');
const adminController = require('../controllers/user.controller');
const { loginUser } = require('../controllers/user.controller');


router.post('/register', userController.registerUser);
router.post('/login', loginUser);
router.get('/users', userController.getAllUsers);
router.get('/users/:userId', userController.getUserById);
router.get('/admins', adminController.getAllAdmins);
router.get('/admins/:adminId', adminController.getAdminById);

module.exports = router;