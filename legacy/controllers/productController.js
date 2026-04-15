
const Product = require('../models/Product');

/**
 * @desc    Obtener todos los productos
 * @route   GET /api/products
 * @access  Público
 */
exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find().sort({ category: 1 });
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Crear un nuevo producto (Admin)
 * @route   POST /api/products
 * @access  Privado (Simulado)
 */
exports.createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};
