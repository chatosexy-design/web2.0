"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const protect = async (req, res, next) => {
    // LOGIN TEMPORALMENTE DESACTIVADO
    // Mock user for development
    req.user = {
        id: 'mock-user-id',
        role: 'STUDENT', // Default role
        studentId: 'mock-student-id'
    };
    return next();
    /* Logic to be re-enabled later:
    let token;
    ...
    */
};
exports.protect = protect;
const authorize = (...roles) => {
    return (req, res, next) => {
        // LOGIN TEMPORALMENTE DESACTIVADO
        return next();
        /* Logic to be re-enabled later:
        if (!req.user || !roles.includes(req.user.role)) {
          ...
        }
        next();
        */
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map