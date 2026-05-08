"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const roles_1 = require("../types/roles");
const normalizeRole = (role) => {
    const upper = String(role || '').toUpperCase();
    if (upper === roles_1.Roles.ADMIN)
        return roles_1.Roles.ADMIN;
    if (upper === roles_1.Roles.CAFETERIA)
        return roles_1.Roles.CAFETERIA;
    return roles_1.Roles.STUDENT;
};
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ success: false, error: 'No autorizado' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = {
            id: decoded.id,
            role: normalizeRole(decoded.role),
            studentId: decoded.studentId
        };
        return next();
    }
    catch (_error) {
        return res.status(401).json({ success: false, error: 'Token inválido o expirado' });
    }
};
exports.protect = protect;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `El rol ${req.user?.role} no tiene permisos para esta acción`
            });
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map