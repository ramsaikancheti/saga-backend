const { User, getNextUserId } = require('../models/user.models');
const { Admin, getNextAdminId } = require('../models/admin.model');

const express = require('express');
const router = express.Router(); 


const registerUser = async (req, res) => {
    const { name, email, password, role, phoneNumber } = req.body;

    try {
        const defaultRole = 'user';
        const selectedRole = role || defaultRole;

        const registrationDate = new Date();  

        if (selectedRole === 'user') {
            const nextUserId = await getNextUserId();
            const newUser = new User({
                userId: nextUserId,
                name,
                email,
                password,
                phoneNumber,
                registrationDate,  
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
                registrationDate,  
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

        if (!user) {
             user = await Admin.findOne({ email: identifier, password });
        }

        if (user) {
            const userName = user.name;
            const userRole = user instanceof Admin ? 'admin' : 'user';

            res.status(200).json({ success: true, message: 'Login successful!', name: userName, role: userRole });
        } else {
            res.status(401).json({ success: false, message: 'Login failed. Please check your credentials.' });
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

const deleteUserById = async (req, res) => {
    const userId = req.params.userId;

    try {
        const deletedUser = await User.findOneAndDelete({ userId });

        if (deletedUser) {
            res.status(200).json({ success: true, message: 'User deleted successfully', deletedUser });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user by userId:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const updateUserById = async (req, res) => {
    const userId = req.params.userId;
    const { name, email, password, phoneNumber } = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { userId: userId },
            { $set: { name, email, password, phoneNumber } },
            { new: true }
        );

        if (updatedUser) {
            res.status(200).json({ success: true, message: 'User updated successfully', updatedUser });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user by userId:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const deleteAdminById = async (req, res) => {
    const adminId = req.params.adminId;

    try {
        const deletedAdmin = await Admin.findOneAndDelete({ adminId });

        if (deletedAdmin) {
            res.status(200).json({ success: true, message: 'Admin deleted successfully', deletedAdmin });
        } else {
            res.status(404).json({ success: false, message: 'Admin not found' });
        }
    } catch (error) {
        console.error('Error deleting admin by adminId:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const updateAdminById = async (req, res) => {
    const adminId = req.params.adminId;
    const { name, email, password, phoneNumber } = req.body;

    try {
        const updatedAdmin = await Admin.findOneAndUpdate(
            { adminId: adminId },
            { $set: { name, email, password, phoneNumber } },
            { new: true }
        );

        if (updatedAdmin) {
            res.status(200).json({ success: true, message: 'Admin updated successfully', updatedAdmin });
        } else {
            res.status(404).json({ success: false, message: 'Admin not found' });
        }
    } catch (error) {
        console.error('Error updating admin by adminId:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllAdmins,
    getAdminById,
    registerUser,
    loginUser,
    getUserById,
    getAllUsers,
    deleteUserById,
    updateUserById,
    deleteAdminById,
    updateAdminById,
};