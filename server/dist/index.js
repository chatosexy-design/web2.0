"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    await (0, db_1.connectDB)();
    app_1.default.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`✅ MongoDB integration ready`);
    });
};
startServer().catch((error) => {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map