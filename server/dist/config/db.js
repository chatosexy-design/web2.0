"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/NUTRI';
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(MONGODB_URI);
        console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
        // Limpieza de indice legado de versiones anteriores (campo userId ya no existe)
        const students = mongoose_1.default.connection.collection('students');
        const indexes = await students.indexes();
        const hasLegacyUserIdIndex = indexes.some((idx) => idx.name === 'userId_1');
        if (hasLegacyUserIdIndex) {
            await students.dropIndex('userId_1');
            console.log('🧹 Indice legado eliminado: students.userId_1');
        }
    }
    catch (error) {
        console.error(`❌ Error de Conexión a MongoDB: ${error.message}`);
        throw error;
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map