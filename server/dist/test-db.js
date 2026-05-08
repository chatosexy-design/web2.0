"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./config/db");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const testMongoose = async () => {
    try {
        console.log('🔍 Probando conexión a MongoDB...');
        console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Definida' : 'No definida');
        await (0, db_1.connectDB)();
        console.log('✅ Conexión exitosa con Mongoose');
        await mongoose_1.default.connection.close();
        console.log('📡 Conexión cerrada');
    }
    catch (error) {
        console.error('❌ Error al conectar con MongoDB:', error);
        process.exit(1);
    }
};
testMongoose();
//# sourceMappingURL=test-db.js.map