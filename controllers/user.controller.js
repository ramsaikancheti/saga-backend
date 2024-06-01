const { User, getNextUserId } = require('../models/user.models'); 
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router(); 

const { parsePhoneNumberFromString } = require('libphonenumber-js');

const registerUser = async (req, res) => {
    const { name, email, password, confirmPassword, phoneNumber } = req.body;

    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email address.'});
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({ success: false, message: 'Invalid phone number format. Please enter a valid mobile number.'});
        }

        const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, 'IN');
        if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
            return res.status(400).json({ success: false, message: 'Invalid phone number.'});
        }

        const defaultRole = 'user';
        const selectedRole = defaultRole; 
        const registrationDate = new Date();

        const nextUserId = await getNextUserId();
        const newUser = new User({
            userId: nextUserId,
            name,
            email,
            password,
            confirmPassword,
            phoneNumber,
            registrationDate,
        });
        await newUser.save();
        res.status(201).json({ success: true, message: 'User registration successful!'});
    } 
    catch (error) {
        console.error('Error during user registration:', error.message);

        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            res.status(400).json({ success: false, message: 'Email address is already in use.'});
        } 
        else {
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
      } 
      else if (isPhoneNumber) {
        user = await User.findOne({ phoneNumber: identifier, password });
      }
  
      if (user) {
        const token = jwt.sign(
          { userId: user.userId, email: user.email },
          'your_secret_key',
          { expiresIn: '5h' }
        );
  
        const decodedToken = jwt.decode(token);
        const expirationTime = decodedToken.exp;
  
        let userRole;
        let userName;
        let userId;
  
        userRole = 'user';
        userName = user.name;
        userId = user.userId;
  
        res.status(200).json({
          success: true,
          message: 'Login successful!',
          name: userName,
          role: userRole,
          userId,
          token,
          expirationTime
        });
      } 
      else {
        res.status(401).json({ success: false, message: 'Login failed. Please check your credentials.' });
      }
    } 
    catch (error) {
      console.error('Error during login:', error.message);
      res.status(500).send('Internal Server Error');
    }
  };

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find();
        res.status(200).json({ success: true, users: allUsers });
    } 
    catch (error) {
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
    } 
    catch (error) {
        console.error('Error fetching user by userId:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}; 

module.exports = {
    registerUser,
    loginUser,
    getUserById,
    getAllUsers,
 };