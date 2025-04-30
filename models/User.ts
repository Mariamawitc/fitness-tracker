import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  name: string;
  image?: string;
  height?: number;  // in cm
  weight?: number;  // in kg
  goals?: {
    targetWeight?: number;
    weeklyWorkouts?: number;
    dailyCalories?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
