"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const Student_1 = __importDefault(require("../models/Student"));
const roles_1 = require("../types/roles");
const normalizeRole = (role) => {
    const upper = String(role || '').toUpperCase();
    if (upper === roles_1.Roles.ADMIN)
        return roles_1.Roles.ADMIN;
    if (upper === roles_1.Roles.CAFETERIA)
        return roles_1.Roles.CAFETERIA;
    return roles_1.Roles.STUDENT;
};
const register = async (req, res, next) => {
    const { firstName, lastName, semester, email, specialty, shift, password, age, weight, height, sex, activityLevel, goal } = req.body;
    try {
        if (!firstName || !lastName || !semester || !email || !specialty || !shift || !password) {
            return res.status(400).json({
                success: false,
                error: 'Todos los campos básicos del alumno son obligatorios'
            });
        }
        const existingUser = await User_1.default.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'El correo ya está registrado' });
        }
        const fullName = `${firstName} ${lastName}`.trim();
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // 1. Crear usuario en MongoDB
        const user = await User_1.default.create({
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            name: fullName,
            role: roles_1.Roles.STUDENT
        });
        // 2. Crear registro de estudiante
        const student = await Student_1.default.create({
            user: user._id,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            semester: String(semester).trim(),
            specialty: specialty.trim(),
            shift: shift.trim(),
            age: age || 17,
            weight: weight || 65,
            height: height || 183,
            sex: sex || 'Otro',
            activityLevel: activityLevel || 'moderado',
            goal: goal || 'mantener',
            parentAccessCode: Math.random().toString(36).substring(2, 8).toUpperCase()
        });
        const token = jsonwebtoken_1.default.sign({ id: user._id.toString(), role: roles_1.Roles.STUDENT, studentId: student._id.toString() }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
        res.status(201).json({
            success: true,
            message: 'Usuario registrado con éxito.',
            token,
            user: { id: user._id.toString(), email: user.email, role: roles_1.Roles.STUDENT, name: fullName, studentId: student._id.toString() },
            student
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ email: email.toLowerCase().trim() });
        if (!user || !user.password) {
            return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
        }
        const student = await Student_1.default.findOne({ user: user._id });
        const token = jsonwebtoken_1.default.sign({ id: user._id.toString(), role: normalizeRole(user.role), studentId: student?._id?.toString() }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
        res.status(200).json({
            success: true,
            token,
            user: { id: user._id.toString(), email: user.email, name: user.name, role: normalizeRole(user.role), studentId: student?._id?.toString() },
            student
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
//# sourceMappingURL=auth.js.map