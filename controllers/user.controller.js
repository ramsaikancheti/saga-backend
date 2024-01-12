const { User, getNextUserId } = require('../models/user.models');
const { Admin, getNextAdminId } = require('../models/admin.model');

const express = require('express');
const router = express.Router(); 


const registerUser = async (req, res) => {
    const { name, email, password, role, phoneNumber } = req.body;

    try {
        const defaultRole = 'user';
        const selectedRole = role || defaultRole;

        if (selectedRole === 'user') {
            const nextUserId = await getNextUserId();
            const newUser = new User({
                userId: nextUserId,
                name,
                email,
                password,
                phoneNumber,
            });
            await newUser.save();
            res.status(201).json({ success: true, message: 'User registration successful!' });
        } else if (selectedRole === 'admin') {
            const adminId = await getNextAdminId();
            const newAdmin = new Admin({
                adminId,
                name,
                email,
                password,
                phoneNumber,
            });
            await newAdmin.save();
            res.status(201).json({ success: true, message: 'Admin registration successful!' });
        }
    } catch (error) {
        console.error('Error during user registration:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const loginUser = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const isEmail = /\S+@\S+\.\S+/.test(identifier);
        const isPhoneNumber = /^\d{10}$/.test(identifier);

        if (!(isEmail || isPhoneNumber)) {
            return res.status(400).send('Invalid email or phone number format');
        }

        let user;

        if (isEmail) {
            user = await User.findOne({ email: identifier, password });
        } else if (isPhoneNumber) {
            user = await User.findOne({ phoneNumber: identifier, password });
        }

        if (user) {
            res.status(200).send({ success: true, message: 'Login successful!' });
        } else {
            res.status(401).send({ success: false, message: 'Login failed. Please check your credentials.' });
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = {
    registerUser,
    loginUser,
};