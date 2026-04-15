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
}

export interface Student {
  id: string;
  controlNumber: string;
  name: string;
  group: string;
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

export interface FoodLog {
  id: string;
  itemName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
}
