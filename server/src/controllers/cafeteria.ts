import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { analyzeFoodIA } from '../services/nutrition';

export const getDishes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dishes = await prisma.dish.findMany({ where: { available: true } });
    res.status(200).json({ success: true, data: dishes });
  } catch (error) {
    next(error);
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
