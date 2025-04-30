import { ObjectId } from 'mongodb';

export interface FoodItem {
  name: string;
  servingSize: number;  // in grams
  calories: number;
  protein: number;  // in grams
  carbs: number;    // in grams
  fats: number;     // in grams
}

export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: FoodItem[];
  totalCalories: number;
}

export interface NutritionLog {
  _id?: ObjectId;
  userId: ObjectId;
  date: Date;
  meals: Meal[];
  totalCalories: number;
  waterIntake?: number;  // in ml
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
