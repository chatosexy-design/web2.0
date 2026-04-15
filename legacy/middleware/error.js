
/**
 * Middleware centralizado para el manejo de errores
 * Captura errores y envía una respuesta estandarizada al cliente
 */
const errorHandler = (err, req, res, next) => {
    console.error(`❌ Error detectado: ${err.message}`);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        error: err.message || 'Error interno del servidor',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler;
