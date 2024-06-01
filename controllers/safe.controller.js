const { SafeUser, getNextSafeUserId } = require('../models/safe.model');

const registerSafeUser = async (req, res) => {
    const { name, email, phoneNumber, password } = req.body;

    try {

        const registrationDate = new Date();

        const nextSafeUserId = await getNextSafeUserId();
        const newSafeUser = new SafeUser({
            safeId: nextSafeUserId,
            name,
            email,
            phoneNumber,
            password,
            registrationDate,
        });
        await newSafeUser.save();
        res.status(201).json({ success: true, message: 'Safe registration successful!' });
    } catch (error) {
        console.error('Error during safe registration:', error.message);

        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            res.status(400).json({ success: false, message: 'Email address is already in use.' });
        } else {
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};


const loginSafeUser = async (req, res) => {
    const { password } = req.body;

    try {
        if (!password) {
            return res.status(400).send('Password is required.');
        }

        const safeUser = await SafeUser.findOne({ password });

        if (safeUser) {
            let userName = safeUser.name;
            let safeUserId = safeUser.safeId;

            res.status(200).json({ success: true, message: 'Login successful!', name: userName, safeUserId });
        } else {
            res.status(401).json({ success: false, message: 'Login failed. Please check your credentials.' });
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).send('Internal Server Error');
    }
}; 

module.exports = { loginSafeUser };


module.exports = { registerSafeUser, loginSafeUser };
