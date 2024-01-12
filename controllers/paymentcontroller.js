const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Payment = require('../models/payment.Model');

const paymentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const paymentUpload = multer({ storage: paymentStorage });

router.use('/payment-uploads', express.static(path.join(__dirname, 'payment-uploads')));

router.post('/addPayment', paymentUpload.single('image'), async (req, res) => {
    console.log('Request Body:', req.body);
    console.log('Request File:', req.file);

    const { name } = req.body;

    try {
        let image;

        if (req.file) {
            image = 'uploads/' + req.file.originalname;
        } else {
            image = 'uploads/default-image.jpg';
        }

        const newPayment = new Payment({
            name,
            image,
        });

        await newPayment.save();
        res.send('Payment added successfully!');
    } catch (error) {
        console.error('Error saving payment:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
 


router.get('/paymentmethods', async (req, res) => {
    try {
        const paymentMethods = await Payment.find({}, { _id: 0, name: 1, image: 1 });

        const formattedPaymentMethods = paymentMethods.map(method => ({
            id: method._id,
            name: method.name,
            image: method.image,
        }));

        res.json(formattedPaymentMethods);
    } catch (error) {
        console.error('Error fetching payment methods:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;