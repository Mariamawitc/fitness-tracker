'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { format } from 'date-fns';
import WorkoutForm from './WorkoutForm';

interface WorkoutFormData {
  title: string;
  date: string;
  exercises: Exercise[];
  notes: string;
}

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

interface Workout {
  _id: string;
  title: string;
  date: string;
  exercises: Exercise[];
  notes: string;
  createdAt: string;
}

export default forwardRef(function WorkoutList(_, ref) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useImperativeHandle(ref, () => ({
    fetchWorkouts,
  }));

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch('/api/workouts');
      if (!response.ok) {
        throw new Error('Failed to fetch workouts');
      }
      const data = await response.json();
      setWorkouts(data);
    } catch (err) {
      setError('Failed to load workouts');
      console.error('Error fetching workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchWorkouts}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No workouts recorded yet.</p>
      </div>
    );
  }

  const handleEdit = async (workoutId: string, data: WorkoutFormData) => {
    try {
      const response = await fetch('/api/workouts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: workoutId,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update workout');
      }

      setEditingWorkout(null);
      fetchWorkouts();
    } catch (error) {
      console.error('Error updating workout:', error);
    }
  };

  const handleDelete = async (workoutId: string) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/workouts?id=${workoutId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete workout');
      }

      fetchWorkouts();
    } catch (error) {
      console.error('Error deleting workout:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleWorkout = (workoutId: string) => {
    if (editingWorkout) return;
    setExpandedWorkout(expandedWorkout === workoutId ? null : workoutId);
  };

  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <div
          key={workout._id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 hover:bg-gray-50">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleWorkout(workout._id)}
            >
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900">{workout.title}</h3>
                <p className="text-sm text-gray-600">
                  {format(new Date(workout.date), 'MMMM d, yyyy')}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    expandedWorkout === workout._id ? 'rotate-180' : ''
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
                onClick={() => setEditingWorkout(workout._id)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                disabled={isDeleting}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(workout._id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>

          {editingWorkout === workout._id ? (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <WorkoutForm
                initialData={{
                  title: workout.title,
                  date: new Date(workout.date).toISOString().split('T')[0],
                  exercises: workout.exercises,
                  notes: workout.notes || '',
                }}
                onSubmit={(data) => handleEdit(workout._id, data)}
                onCancel={() => setEditingWorkout(null)}
              />
            </div>
          ) : expandedWorkout === workout._id && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Exercises:</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {workout.exercises.map((exercise, index) => (
                      <div
                        key={index}
                        className="bg-white p-3 rounded border border-gray-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{exercise.name}</p>
                            <p className="text-sm text-gray-600">
                              {exercise.sets} sets × {exercise.reps} reps
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {exercise.weight} kg
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {workout.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Notes:</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                      {workout.notes}
                    </p>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Added on {format(new Date(workout.createdAt), 'MMMM d, yyyy')}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
});
