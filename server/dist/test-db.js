"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const testPrisma = async () => {
    try {
        console.log('🔍 Probando conexión a la base de datos...');
        console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Definida' : 'No definida');
        // Intenta una operación simple
        await db_1.default.$connect();
        console.log('✅ Conexión exitosa con Prisma Client');
        await db_1.default.$disconnect();
    }
    catch (error) {
        console.error('❌ Error al conectar con Prisma:', error);
        process.exit(1);
    }
};
testPrisma();
//# sourceMappingURL=test-db.js.map