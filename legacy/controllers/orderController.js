
const Order = require('../models/Order');

/**
 * @desc    Obtener todos los pedidos del usuario autenticado
 * @route   GET /api/orders
 * @access  Privado
 */
exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.userId })
            .populate('products.product')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Registrar un nuevo consumo de alimentos
 * @route   POST /api/orders
 * @access  Privado
 */
exports.createOrder = async (req, res, next) => {
    try {
        const order = await Order.create({
            ...req.body,
            user: req.user.userId
        });

        const fullOrder = await Order.findById(order._id).populate('products.product');
        res.status(201).json({ success: true, data: fullOrder });
    } catch (error) {
        next(error);
    }
};
