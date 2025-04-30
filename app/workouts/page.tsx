'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import WorkoutForm from '../components/WorkoutForm';
import WorkoutList from '../components/WorkoutList';

export default function Workouts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const workoutListRef = useRef<{ fetchWorkouts: () => void } | null>(null);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  const handleWorkoutSubmit = async (workoutData: any) => {
    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
      });

      if (!response.ok) {
        throw new Error('Failed to save workout');
      }

      setIsFormVisible(false);
      // Refresh the workout list
      workoutListRef.current?.fetchWorkouts();
    } catch (error) {
      console.error('Error saving workout:', error);
      // TODO: Add error notification
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Workouts</h1>
            <button
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {isFormVisible ? 'Cancel' : 'Add Workout'}
            </button>
          </div>

          {isFormVisible && (
            <div className="border-t border-gray-200 pt-6">
              <WorkoutForm onSubmit={handleWorkoutSubmit} />
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Workouts</h2>
          <WorkoutList ref={workoutListRef} />
        </div>
      </div>
    </main>
  );
}
