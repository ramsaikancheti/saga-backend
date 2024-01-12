const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    paymentId: { type: Number, unique: true },
    name: { type: String, required: true },
    image: { type: String },
});

paymentSchema.pre('save', async function (next) {
    const currentPayment = this;

    if (!currentPayment.paymentId) {
        const highestPayment = await Payment.findOne().sort({ paymentId: -1 });
        currentPayment.paymentId = highestPayment ? highestPayment.paymentId + 1 : 1;
    }

    next();
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;

