const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    addressId: { type: Number, required: true },
    hNo: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
});

const Address = mongoose.model('Address', addressSchema);

const getNextAddressId = async () => {
    const latestAddress = await Address.findOne().sort({ addressId: -1 });
    return latestAddress ? latestAddress.addressId + 1 : 1;
};

module.exports = { Address, getNextAddressId };



