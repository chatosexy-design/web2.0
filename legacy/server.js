
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Conexión a Base de Datos
connectDB();

const app = express();

// --- Middlewares de Seguridad y Utilidad ---
app.use(helmet()); // Seguridad de encabezados HTTP
app.use(cors()); // Permitir peticiones cross-origin
app.use(express.json()); // Parsear JSON
app.use(morgan('dev')); // Logger para desarrollo

// Rate Limiting: Prevenir ataques de fuerza bruta y DoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 peticiones por ventana
    message: { success: false, error: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde.' }
});
app.use('/api/', limiter);

// --- Importación de Rutas ---
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const nutritionRoutes = require('./routes/nutrition');
const chatRoutes = require('./routes/chat');

// --- Definición de Rutas API ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/chat', chatRoutes);

// Ruta de Salud
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🚀 Chato Sano API operativa al 200%',
        version: '2.0.0'
    });
});

// --- Middleware Global de Manejo de Errores ---
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
    🚀 Servidor Chato Sano Iniciado
    📡 Puerto: ${PORT}
    🌐 URL: http://localhost:${PORT}
    `);
});
