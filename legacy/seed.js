
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

/**
 * Script para poblar la base de datos con productos iniciales (Menú de Cafetería).
 */

const products = [
    { 
        name: "Pechuga al Grill", 
        description: "Pechuga de pollo a la plancha con guarnición de verduras.",
        price: 110, 
        category: "Bajo en Grasa",
        nutritionalInfo: { calories: 450, protein: 45, carbs: 10, fat: 8 }
    },
    { 
        name: "Tacos de Bistec", 
        description: "Tres tacos de bistec de res con tortilla de maíz.",
        price: 95, 
        category: "Proteína",
        nutritionalInfo: { calories: 450, protein: 35, carbs: 30, fat: 12 }
    },
    { 
        name: "Enchiladas Verdes", 
        description: "Tortillas rellenas de pollo bañadas en salsa verde.",
        price: 105, 
        category: "Tradicional",
        nutritionalInfo: { calories: 580, protein: 28, carbs: 45, fat: 18 }
    },
    { 
        name: "Pozole de Pollo", 
        description: "Caldo tradicional con maíz pozolero y pechuga deshebrada.",
        price: 85, 
        category: "Completo",
        nutritionalInfo: { calories: 420, protein: 32, carbs: 40, fat: 10 }
    },
    { 
        name: "Pescado al Vapor", 
        description: "Filete de pescado fresco cocido al vapor con finas hierbas.",
        price: 125, 
        category: "Omega 3",
        nutritionalInfo: { calories: 320, protein: 40, carbs: 5, fat: 6 }
    },
    { 
        name: "Ensalada Mix", 
        description: "Mezcla de lechugas, espinacas, jitomate y aderezo ligero.",
        price: 65, 
        category: "Fibra",
        nutritionalInfo: { calories: 150, protein: 5, carbs: 12, fat: 4 }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB para poblar datos...');
        
        // Limpiar productos existentes (opcional, cuidado en producción)
        await Product.deleteMany({});
        console.log('Colección de productos limpiada.');
        
        // Insertar nuevos productos
        await Product.insertMany(products);
        console.log('¡Base de datos poblada con éxito!');
        
        mongoose.connection.close();
    } catch (err) {
        console.error('Error al poblar la base de datos:', err);
        process.exit(1);
    }
};

seedDB();
