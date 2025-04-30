'use client';

import { useState } from 'react';

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionFormProps {
  initialData?: {
    date: string;
    meals: Meal[];
  };
  onSubmit: (data: {
    date: string;
    meals: Meal[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  }) => void;
  onCancel?: () => void;
}

export default function NutritionForm({
  initialData,
  onSubmit,
  onCancel,
}: NutritionFormProps) {
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split('T')[0]
  );
  const [meals, setMeals] = useState<Meal[]>(
    initialData?.meals || [
      { name: '', calories: 0, protein: 0, carbs: 0, fat: 0 },
    ]
  );

  const handleAddMeal = () => {
    setMeals([
      ...meals,
      { name: '', calories: 0, protein: 0, carbs: 0, fat: 0 },
    ]);
  };

  const handleRemoveMeal = (index: number) => {
    setMeals(meals.filter((_, i) => i !== index));
  };

  const handleMealChange = (
    index: number,
    field: keyof Meal,
    value: string | number
  ) => {
    const newMeals = [...meals];
    newMeals[index] = {
      ...newMeals[index],
      [field]: field === 'name' ? value : Number(value),
    };
    setMeals(newMeals);
  };

  const calculateTotals = () => {
    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totals = calculateTotals();
    onSubmit({
      date,
      meals,
      totalCalories: totals.calories,
      totalProtein: totals.protein,
      totalCarbs: totals.carbs,
      totalFat: totals.fat,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Meals</h3>
          <button
            type="button"
            onClick={handleAddMeal}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Meal
          </button>
        </div>

        {meals.map((meal, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700">
                  Meal Name
                </label>
                <input
                  type="text"
                  value={meal.name}
                  onChange={(e) =>
                    handleMealChange(index, 'name', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveMeal(index)}
                className="ml-4 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Calories
                </label>
                <input
                  type="number"
                  value={meal.calories}
                  onChange={(e) =>
                    handleMealChange(index, 'calories', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Protein (g)
                </label>
                <input
                  type="number"
                  value={meal.protein}
                  onChange={(e) =>
                    handleMealChange(index, 'protein', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  value={meal.carbs}
                  onChange={(e) =>
                    handleMealChange(index, 'carbs', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fat (g)
                </label>
                <input
                  type="number"
                  value={meal.fat}
                  onChange={(e) => handleMealChange(index, 'fat', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Daily Totals</h4>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-sm text-gray-500">Calories</p>
            <p className="text-lg font-medium text-gray-900">
              {calculateTotals().calories}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Protein</p>
            <p className="text-lg font-medium text-gray-900">
              {calculateTotals().protein}g
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Carbs</p>
            <p className="text-lg font-medium text-gray-900">
              {calculateTotals().carbs}g
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fat</p>
            <p className="text-lg font-medium text-gray-900">
              {calculateTotals().fat}g
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {initialData ? 'Update Entry' : 'Save Entry'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
