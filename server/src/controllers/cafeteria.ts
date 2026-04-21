import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { analyzeFoodIA } from '../services/nutrition';

const DEFAULT_SCHOOL_MENU = [
  {
    name: 'Chilaquiles Verdes con Pollo',
    description: 'Totopos horneados en salsa verde con pollo deshebrado, crema y queso.',
    price: 45,
    category: 'Desayunos',
    calories: 420,
    protein: 24,
    carbs: 38,
    fat: 18
  },
  {
    name: 'Torta de Jamon con Queso',
    description: 'Bolillo con jamon, queso, jitomate, lechuga y aguacate.',
    price: 35,
    category: 'Desayunos',
    calories: 390,
    protein: 18,
    carbs: 41,
    fat: 16
  },
  {
    name: 'Enchiladas Rojas',
    description: 'Orden de 4 enchiladas con pollo, lechuga, crema y queso fresco.',
    price: 50,
    category: 'Comidas',
    calories: 470,
    protein: 27,
    carbs: 42,
    fat: 20
  },
  {
    name: 'Tacos Dorados de Papa',
    description: 'Orden de 4 tacos dorados acompanados de lechuga, queso y salsa.',
    price: 40,
    category: 'Comidas',
    calories: 360,
    protein: 10,
    carbs: 39,
    fat: 17
  },
  {
    name: 'Hamburguesa Escolar',
    description: 'Hamburguesa sencilla con carne, queso amarillo, lechuga y jitomate.',
    price: 55,
    category: 'Comidas',
    calories: 520,
    protein: 26,
    carbs: 40,
    fat: 28
  },
  {
    name: 'Quesadillas de Tinga',
    description: 'Dos quesadillas de maiz rellenas de tinga de pollo con crema.',
    price: 42,
    category: 'Comidas',
    calories: 410,
    protein: 21,
    carbs: 33,
    fat: 19
  },
  {
    name: 'Jugo de Mango 500 ml',
    description: 'Bebida natural de mango sin gas.',
    price: 22,
    category: 'Bebidas',
    calories: 120,
    protein: 1,
    carbs: 29,
    fat: 0
  },
  {
    name: 'Agua de Horchata 500 ml',
    description: 'Agua fresca de horchata servida fria.',
    price: 20,
    category: 'Bebidas',
    calories: 140,
    protein: 1,
    carbs: 32,
    fat: 1
  },
  {
    name: 'Fruta Picada',
    description: 'Vaso mediano de fruta de temporada con limon y chile en polvo.',
    price: 25,
    category: 'Snacks',
    calories: 95,
    protein: 1,
    carbs: 23,
    fat: 0
  },
  {
    name: 'Yogurt con Granola',
    description: 'Vaso individual de yogurt natural con granola y fruta.',
    price: 28,
    category: 'Snacks',
    calories: 210,
    protein: 8,
    carbs: 30,
    fat: 6
  }
];

const buildFallbackMenu = () =>
  DEFAULT_SCHOOL_MENU.map((dish, index) => ({
    id: `mock-dish-${index + 1}`,
    available: true,
    ...dish
  }));

export const getDishes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let dishes = await prisma.dish.findMany({
      where: { available: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }]
    });

    if (dishes.length === 0) {
      await prisma.dish.createMany({
        data: DEFAULT_SCHOOL_MENU
      });

      dishes = await prisma.dish.findMany({
        where: { available: true },
        orderBy: [{ category: 'asc' }, { name: 'asc' }]
      });
    }

    res.status(200).json({ success: true, data: dishes });
  } catch (error) {
    console.error('Fallo al consultar los platillos en la base de datos, usando menu de prueba:', error);
    res.status(200).json({ success: true, data: buildFallbackMenu(), fallback: true });
  }
};

export const createDish = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, price, category, autoMacros } = req.body;

  try {
    let macros = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    if (autoMacros) {
      const nutrition = await analyzeFoodIA(name);
      macros = {
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat
      };
    } else {
      macros = { 
        calories: req.body.calories || 0, 
        protein: req.body.protein || 0, 
        carbs: req.body.carbs || 0, 
        fat: req.body.fat || 0 
      };
    }

    const dish = await prisma.dish.create({
      data: {
        name,
        description,
        price,
        category,
        ...macros
      }
    });

    res.status(201).json({ success: true, data: dish });
  } catch (error) {
    next(error);
  }
};

export const updateDish = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const dish = await prisma.dish.update({
      where: { id: id as string },
      data: req.body
    });
    res.status(200).json({ success: true, data: dish });
  } catch (error) {
    next(error);
  }
};

export const deleteDish = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.dish.delete({ where: { id: id as string } });
    res.status(200).json({ success: true, message: 'Platillo eliminado' });
  } catch (error) {
    next(error);
  }
};
