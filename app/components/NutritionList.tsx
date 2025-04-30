'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { format } from 'date-fns';
import NutritionForm from './NutritionForm';

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionEntry {
  _id: string;
  date: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  createdAt: string;
}

interface NutritionFormData {
  date: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export default forwardRef(function NutritionList(_, ref) {
  const [entries, setEntries] = useState<NutritionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useImperativeHandle(ref, () => ({
    fetchEntries,
  }));

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/nutrition');
      if (!response.ok) {
        throw new Error('Failed to fetch nutrition entries');
      }
      const data = await response.json();
      setEntries(data);
      setError('');
    } catch (err) {
      setError('Failed to load nutrition entries');
      console.error('Error fetching nutrition entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (entryId: string, data: NutritionFormData) => {
    try {
      const response = await fetch('/api/nutrition', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: entryId,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update nutrition entry');
      }

      setEditingEntry(null);
      fetchEntries();
    } catch (error) {
      console.error('Error updating nutrition entry:', error);
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/nutrition?id=${entryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete nutrition entry');
      }

      fetchEntries();
    } catch (error) {
      console.error('Error deleting nutrition entry:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleEntry = (entryId: string) => {
    if (editingEntry) return;
    setExpandedEntry(expandedEntry === entryId ? null : entryId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchEntries}
          className="text-blue-600 hover:text-blue-800"
        >
          Try again
        </button>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No nutrition entries yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div
          key={entry._id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 hover:bg-gray-50">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleEntry(entry._id)}
            >
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-gray-900">
                  {format(new Date(entry.date), 'MMMM d, yyyy')}
                </p>
                <p className="text-sm text-gray-600">
                  {entry.totalCalories} calories • {entry.totalProtein}g protein
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    expandedEntry === entry._id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => setEditingEntry(entry._id)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                disabled={isDeleting}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(entry._id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>

          {editingEntry === entry._id ? (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <NutritionForm
                initialData={{
                  date: new Date(entry.date).toISOString().split('T')[0],
                  meals: entry.meals,
                }}
                onSubmit={(data) => handleEdit(entry._id, data)}
                onCancel={() => setEditingEntry(null)}
              />
            </div>
          ) : (
            expandedEntry === entry._id && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Daily Totals
                    </h4>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div>
                        <p className="text-sm text-gray-500">Calories</p>
                        <p className="text-lg font-medium text-gray-900">
                          {entry.totalCalories}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Protein</p>
                        <p className="text-lg font-medium text-gray-900">
                          {entry.totalProtein}g
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Carbs</p>
                        <p className="text-lg font-medium text-gray-900">
                          {entry.totalCarbs}g
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fat</p>
                        <p className="text-lg font-medium text-gray-900">
                          {entry.totalFat}g
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Meals
                    </h4>
                    <div className="space-y-4">
                      {entry.meals.map((meal, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg border border-gray-200 p-4"
                        >
                          <h5 className="font-medium text-gray-900 mb-2">
                            {meal.name}
                          </h5>
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div>
                              <p className="text-sm text-gray-500">Calories</p>
                              <p className="text-gray-900">{meal.calories}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Protein</p>
                              <p className="text-gray-900">{meal.protein}g</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Carbs</p>
                              <p className="text-gray-900">{meal.carbs}g</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Fat</p>
                              <p className="text-gray-900">{meal.fat}g</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
});
