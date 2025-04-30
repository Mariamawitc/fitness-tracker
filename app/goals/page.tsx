'use client';

import { useRef, useState } from 'react';
import GoalForm from '../components/GoalForm';
import GoalList from '../components/GoalList';

export default function GoalsPage() {
  const listRef = useRef<{ fetchGoals: () => void }>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (data: {
    title: string;
    category: string;
    targetDate: string;
    targetValue: number;
    currentValue: number;
    unit: string;
    notes: string;
    completed: boolean;
  }) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save goal');
      }

      setShowForm(false);
      listRef.current?.fetchGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {showForm ? 'Cancel' : 'Add Goal'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">New Goal</h2>
          <GoalForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <GoalList ref={listRef} />
    </div>
  );
}