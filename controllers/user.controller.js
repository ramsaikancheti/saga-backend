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

        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
             res.status(400).json({ success: false, message: 'Email address is already in use.' });
        } else {
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
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



const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find();
        res.status(200).json({ success: true, users: allUsers });
    } catch (error) {
        console.error('Error fetching all users:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
};


const getUserById = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findOne({ userId });
        
        if (user) {
            res.status(200).json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user by userId:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const getAllAdmins = async (req, res) => {
    try {
        const allAdmins = await Admin.find();
        res.status(200).json({ success: true, admins: allAdmins });
    } catch (error) {
        console.error('Error fetching all admins:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const getAdminById = async (req, res) => {
    const adminId = req.params.adminId;

    try {
        const admin = await Admin.findOne({ adminId });
        
        if (admin) {
            res.status(200).json({ success: true, admin });
        } else {
            res.status(404).json({ success: false, message: 'Admin not found' });
        }
    } catch (error) {
        console.error('Error fetching admin by adminId:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = {
    getAllAdmins,
    getAdminById,
    registerUser,
    loginUser,
    getUserById,
    getAllUsers,
};