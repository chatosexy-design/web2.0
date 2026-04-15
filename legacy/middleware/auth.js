
const jwt = require('jsonwebtoken');

/**
 * Middleware para proteger rutas privadas
 * Verifica el token JWT enviado en el encabezado Authorization
 */
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ success: false, error: 'No autorizado: Token inválido' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'No autorizado: No se proporcionó un token' });
    }
};

module.exports = { protect };
