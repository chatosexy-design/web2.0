"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const client_1 = require("@prisma/client");
const register = async (req, res, next) => {
    const { email, password, controlNumber } = req.body;
    try {
        // 1. Verificar si el número de control existe (Base de Datos Institucional simulada)
        const student = await db_1.default.student.findUnique({
            where: { controlNumber }
        });
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Número de control no encontrado en el sistema institucional'
            });
        }
        // 2. Verificar si el estudiante ya tiene un usuario
        const existingUser = await db_1.default.user.findUnique({
            where: { studentId: student.id }
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'Este estudiante ya tiene una cuenta registrada'
            });
        }
        // 3. Hashear password y crear usuario
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await db_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                studentId: student.id,
                role: client_1.Role.STUDENT,
                name: student.name
            }
        });
        sendTokenResponse(user, 201, res);
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await db_1.default.user.findUnique({ where: { email } });
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
        }
        sendTokenResponse(user, 200, res);
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const sendTokenResponse = (user, statusCode, res) => {
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role, studentId: user.studentId }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        }
    });
};
//# sourceMappingURL=auth.js.map