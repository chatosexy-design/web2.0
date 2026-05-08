"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const auth_1 = __importDefault(require("./routes/auth"));
const students_1 = __importDefault(require("./routes/students"));
const cafeteria_1 = __importDefault(require("./routes/cafeteria"));
const admin_1 = __importDefault(require("./routes/admin"));
const nutrition_1 = __importDefault(require("./routes/nutrition"));
const error_1 = require("./middleware/error");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/students', students_1.default);
app.use('/api/cafeteria', cafeteria_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/nutrition', nutrition_1.default);
app.use(error_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map