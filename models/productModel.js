const mongoose = require('mongoose');
const { type } = require('os');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String
        }
    ],
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }

}, {timestamps: true})

const product = mongoose.model('product', productSchema);
module.exports = product;