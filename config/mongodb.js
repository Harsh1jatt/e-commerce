const mongoose = require('mongoose');

const connectDB = () => {
    try {
        mongoose.connect(process.env.MONGODBURI).then(() => {
            console.log('Conected To Database');
        }).catch((err) => {
            console.log(err)
        })
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = connectDB;