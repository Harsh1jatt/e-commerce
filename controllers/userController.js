const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const blacklistModel = require('../models/blacklist')
const productModel = require('../models/productModel');
const Razorpay = require('razorpay');
const paymentModel = require('../models/paymentModel');
const orderModel = require('../models/orderModel');


var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});



module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({
                message: 'All Fields Are Required'
            });
        }
        const isUserAlreadyExists = await userModel.findOne({ email });
        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: 'User Already Exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            email,
            password: hashedPassword,
            username,
            role
        })
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

        res.status(201).json({
            message: 'User Created Successfully',
            user,
            token
        })
    }
    catch (err) {
        next(err)
    }
}

module.exports.signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: 'Invalid Email or Password'
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: 'Invalid email or Password'
            })
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

        res.status(200).json({
            message: 'User Signed In Successfully',
            user,
            token
        })

    }
    catch (err) {
        next(err)
    }
}

module.exports.logout = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(400).json({
                message: 'Token is required'
            });
        }
        const isTokenBlackListed = await blacklistModel.findOne({ token });
        if (isTokenBlackListed) {
            return res.status(400).json({
                message: 'Token is already Blacklisted'
            });
        }
        await blacklistModel.create({ token });
        res.status(200).json({
            message: 'Logged out successfully'
        });
    }
    catch (err) {
        next(err);
    }
}

module.exports.getProfile = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        res.status(200).json({
            message: 'User Fetched Successfully',
            user
        })
    }
    catch (err) {
        next(err)
    }
}

module.exports.getProducts = async (req, res, next) => {
    try {
        const products = await productModel.find();
        res.status(200).json({
            message: 'products Fetched Successfully',
            products
        })
    }
    catch (err) {
        next(err)
    }
}

module.exports.getProductById = async (req, res, next) => {
    try {
        const product = await productModel.findById(req.params.id);
        res.status(200).json({
            message: 'product Fetched Successfully',
            product
        })
    }
    catch (err) {
        next(err)
    }
}

module.exports.createOrder = async (req, res, next) => {
    try {
        const product = await productModel.findById(req.params.id);
        const option = {
            amount: product.price * 100,
            currency: 'INR',
            reciept: product._id,
        }
        const order = await instance.orders.create(option);

        res.status(200).json({
            order
        })
        const paymentModel = await paymentModel.create({
            order_id: order.id,
            amount: product.amount,
            currency: 'INR',
            status: "pending"
        })
    }
    catch (err) {
        next(err)
    }
}

module.exports.verifyPayment = async (req, res, next) => {
    try {
        const { paymentId, orderId, signature } = req.body;
        const secret = process.env.RAZORPAY_KEY_SECRET;

        const { validatePaymentVerification } = require('../node_modules/razorpay/dist/utils/razorpay-utils');
        

        const isValid = validatePaymentVerification({
            order_id: orderId,
            payment_id: paymentId,
        }, signature, secret)

        if(isValid){
            const payment = await paymentModel.findOne({
                orderId: orderId
            })
            payment.paymentId = paymentId;
            payment.signature = signature;
            payment.status = 'success';
            await payment.save();
            res.status(200).json({
                message: 'Payment Verified Successfully!'
            })

        }
        else{
            const payment = await paymentModel.findOne({
                orderId: orderId
            })

            payment.status = 'failed';
            res.status(400).json({
                message: 'Payment Verification Failed'
            })
        }

    } catch (error) {
        next(error)
    }
}