// safe.models.js

const mongoose = require('mongoose');

const safeSchema = new mongoose.Schema({
    safeId: { type: Number, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    registrationDate: {
        type: Date,
        default: Date.now,
        get: function () {
            const date = new Date(this._doc.registrationDate);
            const optionsDate = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            };
            const optionsTime = {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            };

            const formattedDate = date.toLocaleString('en-IN', optionsDate);
            const formattedTime = date.toLocaleString('en-IN', optionsTime);

            return `${formattedDate} ${formattedTime}`;
        },
    },
});

safeSchema.pre('validate', function (next) {
    if (this.isModified('password') || this.isNew) {
        // Password validation logic can be added here if needed
        next();
    } else {
        next();
    }
});

const SafeUser = mongoose.model('SafeUser', safeSchema);

async function getNextSafeUserId() {
    try {
        const lastSafeUser = await SafeUser.findOne({}, {}, { sort: { 'safeId': -1 } });

        let nextSafeUserId;

        if (lastSafeUser && lastSafeUser.safeId) {
            nextSafeUserId = lastSafeUser.safeId + 1;
        } else {
            nextSafeUserId = 1;
        }
        return nextSafeUserId;
    } catch (error) {
        console.error('Error getting the next safeId:', error.message);
        throw error;
    }
}

module.exports = { SafeUser, getNextSafeUserId };
