export enum Role {
  STUDENT = 'STUDENT',
  CAFETERIA = 'CAFETERIA',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  role: Role;
  name?: string;
  studentId?: string;
  student?: Student | null;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  semester: string;
  email: string;
  specialty: string;
  shift: string;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  price: number;
  category: string;
  available: boolean;
}

export enum MealType {
  DESAYUNO = 'desayuno',
  ALMUERZO = 'almuerzo',
  CENA = 'cena',
  REFRIGERIO = 'refrigerio'
}

export interface FoodLog {
  id: string;
  itemName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: MealType;
  date: string;
}
