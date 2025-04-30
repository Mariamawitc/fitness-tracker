'use client';

import { useState } from 'react';

interface GoalFormProps {
  initialData?: {
    title: string;
    category: string;
    targetDate: string;
    targetValue: number;
    currentValue: number;
    unit: string;
    notes: string;
    completed: boolean;
  };
  onSubmit: (data: {
    title: string;
    category: string;
    targetDate: string;
    targetValue: number;
    currentValue: number;
    unit: string;
    notes: string;
    completed: boolean;
  }) => void;
  onCancel?: () => void;
}

const categories = [
  'Weight Loss',
  'Muscle Gain',
  'Strength',
  'Endurance',
  'Nutrition',
  'Other',
];

const units = [
  'kg',
  'lbs',
  'reps',
  'minutes',
  'kilometers',
  'miles',
  'calories',
  'grams',
  'percent',
  'other',
];

export default function GoalForm({
  initialData,
  onSubmit,
  onCancel,
}: GoalFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || categories[0]);
  const [targetDate, setTargetDate] = useState(
    initialData?.targetDate || new Date().toISOString().split('T')[0]
  );
  const [targetValue, setTargetValue] = useState(initialData?.targetValue || 0);
  const [currentValue, setCurrentValue] = useState(
    initialData?.currentValue || 0
  );
  const [unit, setUnit] = useState(initialData?.unit || units[0]);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [completed, setCompleted] = useState(initialData?.completed || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      category,
      targetDate,
      targetValue,
      currentValue,
      unit,
      notes,
      completed,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="completed"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="completed"
            className="ml-3 block text-base font-medium text-gray-900"
          >
            Mark goal as completed
          </label>
        </div>
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="targetDate"
            className="block text-sm font-medium text-gray-700"
          >
            Target Date
          </label>
          <input
            type="date"
            id="targetDate"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="unit"
            className="block text-sm font-medium text-gray-700"
          >
            Unit
          </label>
          <select
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="targetValue"
            className="block text-sm font-medium text-gray-700"
          >
            Target Value
          </label>
          <input
            type="number"
            id="targetValue"
            value={targetValue}
            onChange={(e) => setTargetValue(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label
            htmlFor="currentValue"
            className="block text-sm font-medium text-gray-700"
          >
            Current Value
          </label>
          <input
            type="number"
            id="currentValue"
            value={currentValue}
            onChange={(e) => setCurrentValue(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {initialData ? 'Update Goal' : 'Create Goal'}
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
