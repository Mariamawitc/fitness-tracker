'use client';

import { useRef, useState } from 'react';
import NutritionForm from '../components/NutritionForm';
import NutritionList from '../components/NutritionList';

export default function NutritionPage() {
  const listRef = useRef<{ fetchEntries: () => void }>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (data: {
    date: string;
    meals: Array<{
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }>;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  }) => {
    try {
      const response = await fetch('/api/nutrition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save nutrition entry');
      }

      setShowForm(false);
      listRef.current?.fetchEntries();
    } catch (error) {
      console.error('Error saving nutrition entry:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nutrition Tracking</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {showForm ? 'Cancel' : 'Add Entry'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            New Nutrition Entry
          </h2>
          <NutritionForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <NutritionList ref={listRef} />
    </div>
  );
