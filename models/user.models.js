const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: Number, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

async function getNextUserId() {
    try {
        const lastUser = await User.findOne({}, {}, { sort: { 'userId': -1 } });

        let nextUserId;

        if (lastUser && lastUser.userId) {
            nextUserId = lastUser.userId + 1;
        } else {
            nextUserId = 1;
        }
        return nextUserId;
    } catch (error) {
        console.error('Error getting next userId:', error.message);
        throw error;
    }
}

module.exports = {
    User,
    getNextUserId,
};
