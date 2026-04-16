"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const error_1 = require("./middleware/error");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
// app.use(helmet());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
/*
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/cafeteria', cafeteriaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/nutrition', nutritionRoutes);
*/
// Error Handler
app.use(error_1.errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
process.on('exit', (code) => {
    console.log(`Process about to exit with code: ${code}`);
});
//# sourceMappingURL=index.js.map