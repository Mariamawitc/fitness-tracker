'use client';

import { useState } from 'react';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

interface WorkoutFormProps {
  initialData?: {
    title: string;
    date: string;
    exercises: Exercise[];
    notes: string;
  };
  onSubmit: (workout: {
    title: string;
    date: string;
    exercises: Exercise[];
    notes: string;
  }) => void;
  onCancel?: () => void;
}

export default function WorkoutForm({ initialData, onSubmit, onCancel }: WorkoutFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split('T')[0]
  );
  const [exercises, setExercises] = useState<Exercise[]>(
    initialData?.exercises || [{ name: '', sets: 0, reps: 0, weight: 0 }]
  );
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: 0, reps: 0, weight: 0 }]);
  };

  const handleExerciseChange = (index: number, field: keyof Exercise, value: string | number) => {
    const updatedExercises = exercises.map((exercise, i) => {
      if (i === index) {
        return { ...exercise, [field]: value };
      }
      return exercise;
    });
    setExercises(updatedExercises);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      date,
      exercises,
      notes,
    });
    // Reset form
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setExercises([{ name: '', sets: 0, reps: 0, weight: 0 }]);
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Workout Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Exercises</h3>
          <button
            type="button"
            onClick={handleAddExercise}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Exercise
          </button>
        </div>

        {exercises.map((exercise, index) => (
          <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-md">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Exercise Name</label>
              <input
                type="text"
                value={exercise.name}
                onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sets</label>
              <input
                type="number"
                value={exercise.sets}
                onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                required
                min="0"
                className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Reps</label>
              <input
                type="number"
                value={exercise.reps}
                onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value))}
                required
                min="0"
                className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
              <input
                type="number"
                value={exercise.weight}
                onChange={(e) => handleExerciseChange(index, 'weight', parseFloat(e.target.value))}
                required
                min="0"
                step="0.5"
                className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {exercises.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveExercise(index)}
                className="mt-6 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
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
          className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {initialData ? 'Update Workout' : 'Save Workout'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
