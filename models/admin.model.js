const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    adminId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
});

const Admin = mongoose.model('Admin', adminSchema);

async function getNextAdminId() {
    try {
        const lastAdmin = await Admin.findOne({}, {}, { sort: { 'adminId': -1 } });

        let nextAdminId;

        if (lastAdmin && !isNaN(lastAdmin.adminId)) {
            nextAdminId = lastAdmin.adminId + 1;
        } else {
            nextAdminId = 1;
        }

        if (isNaN(nextAdminId)) {
            throw new Error('Invalid adminId');
        }

        return nextAdminId;
    } catch (error) {
        console.error('Error getting next adminId:', error.message);
        throw error;
    }
}

module.exports = { Admin, getNextAdminId };
