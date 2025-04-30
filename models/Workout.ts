import { ObjectId } from 'mongodb';

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;  // in kg
  duration?: number;  // in minutes
  distance?: number;  // in meters
}

export interface Workout {
  _id?: ObjectId;
  userId: ObjectId;
  date: Date;
  type: 'strength' | 'cardio' | 'flexibility' | 'mixed';
  exercises: Exercise[];
  duration: number;  // total duration in minutes
  caloriesBurned?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
