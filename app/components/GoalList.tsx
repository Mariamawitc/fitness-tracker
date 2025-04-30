'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { format } from 'date-fns';
import GoalForm from './GoalForm';

interface Goal {
  _id: string;
  title: string;
  category: string;
  targetDate: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  notes: string;
  completed: boolean;
  createdAt: string;
}

interface GoalFormData {
  title: string;
  category: string;
  targetDate: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  notes: string;
  completed: boolean;
}

export default forwardRef(function GoalList(_, ref) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useImperativeHandle(ref, () => ({
    fetchGoals,
  }));

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals');
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      const data = await response.json();
      setGoals(data);
      setError('');
    } catch (err) {
      setError('Failed to load goals');
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (goalId: string, data: GoalFormData) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: goalId,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update goal');
      }

      setEditingGoal(null);
      fetchGoals();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleDelete = async (goalId: string) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/goals?id=${goalId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete goal');
      }

      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleGoal = (goalId: string) => {
    if (editingGoal) return;
    setExpandedGoal(expandedGoal === goalId ? null : goalId);
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
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
          onClick={fetchGoals}
          className="text-blue-600 hover:text-blue-800"
        >
          Try again
        </button>
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No goals set yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <div
          key={goal._id}
          className={`bg-white rounded-lg shadow-sm border overflow-hidden ${
            goal.completed
              ? 'border-green-200 bg-green-50'
              : 'border-gray-200'
          }`}
        >
          <div className="px-6 py-4 hover:bg-gray-50">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleGoal(goal._id)}
            >
              <div className="flex-grow">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {goal.title}
                  </h3>
                  {goal.completed && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Target: {goal.targetValue} {goal.unit} by{' '}
                  {format(new Date(goal.targetDate), 'MMMM d, yyyy')}
                </p>
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="flex-grow">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-2 rounded-full ${
                            goal.completed
                              ? 'bg-green-500'
                              : 'bg-blue-500'
                          }`}
                          style={{
                            width: `${calculateProgress(
                              goal.currentValue,
                              goal.targetValue
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    expandedGoal === goal._id ? 'rotate-180' : ''
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
                onClick={() => setEditingGoal(goal._id)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                disabled={isDeleting}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(goal._id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>

          {editingGoal === goal._id ? (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <GoalForm
                initialData={{
                  title: goal.title,
                  category: goal.category,
                  targetDate: new Date(goal.targetDate).toISOString().split('T')[0],
                  targetValue: goal.targetValue,
                  currentValue: goal.currentValue,
                  unit: goal.unit,
                  notes: goal.notes,
                  completed: goal.completed,
                }}
                onSubmit={(data) => handleEdit(goal._id, data)}
                onCancel={() => setEditingGoal(null)}
              />
            </div>
          ) : (
            expandedGoal === goal._id && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Category</h4>
                    <p className="mt-1 text-gray-600">{goal.category}</p>
                  </div>
                  {goal.notes && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Notes</h4>
                      <p className="mt-1 text-gray-600 whitespace-pre-wrap">
                        {goal.notes}
                      </p>
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Progress</h4>
                    <div className="mt-1 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Current</p>
                        <p className="text-lg font-medium text-gray-900">
                          {goal.currentValue} {goal.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Target</p>
                        <p className="text-lg font-medium text-gray-900">
                          {goal.targetValue} {goal.unit}
                        </p>
                      </div>
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
