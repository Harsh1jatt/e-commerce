const mongoose = require('mongoose');
const { type } = require('os');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    orderId: {
        type: String,
        required: true,
    },
    paymentId: {
        type: String,
        required: true,
        unique: true,
    },
    signature: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        required: true,
    },

}, {timestamps: true})

const payment = mongoose.model('payment', paymentSchema);
module.exports = payment;