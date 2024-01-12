const { Address, getNextAddressId } = require('../models/address.model');
const Cart = require('../models/cart.model');  

const addAddress = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const { hNo, area, city, state, pincode } = req.body;

        if (!hNo || !area || !city || !state || !pincode) {
            return res.status(400).json({ success: false, message: 'All address fields are required' });
        }

        const nextAddressId = await getNextAddressId();

        const newAddress = new Address({
            userId,
            addressId: nextAddressId,
            hNo,
            area,
            city,
            state,
            pincode,
        });

        await newAddress.validate();
        await newAddress.save();

        res.json({ success: true, message: 'Address added successfully!', addressId: newAddress.addressId });

    } catch (error) {
        console.error('Error adding address:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const getUserAddress = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);

        const addresses = await Address.find({ userId }, 'addressId hNo area city state pincode');

        let userCart;

        if (req.params.cart === 'cart') {
            userCart = await Cart.findOne({ userId });
        }

        const userWithAddress = {
            addresses: addresses.map(address => address.toObject()),
            cart: userCart ? userCart.products.map(product => product.toObject()) : undefined,
        };

        res.json({ success: true, userWithAddress });
    } catch (error) {
        console.error('Error fetching user and address details:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = { addAddress, getUserAddress };