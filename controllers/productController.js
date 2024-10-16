const productModel = require('../models/productModel');

module.exports.createProduct = async (req, res) => {
    try {

        const { name, description, price } = req.body;

        const images = req.files.map(file => file.publicUrl).filter(url => url ? true : false)

        if (!name || !description || !price) {

            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        const product = await productModel.create({
            name, description, price, images, seller: req.user._id
        })

        res.status(200).json({
            message: 'Product Created Successfully!'
        })
    }
    catch (err) {
        res.status(500).json(error)
    }
}