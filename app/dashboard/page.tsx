'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white shadow-sm rounded-lg mb-6 p-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {session?.user?.name}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Workouts Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Workouts</h2>
            <p className="text-gray-600 mb-4">Track and manage your workouts</p>
            <a
              href="/workouts"
              className="block w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition-colors text-center"
            >
              View Workouts
            </a>
          </div>

          {/* Nutrition Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Nutrition</h2>
            <p className="text-gray-600 mb-4">Log and monitor your meals</p>
            <a
              href="/nutrition"
              className="block w-full bg-green-600 text-white rounded-md py-2 hover:bg-green-700 transition-colors text-center"
            >
              View Nutrition Log
            </a>
          </div>

          {/* Progress Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress</h2>
            <p className="text-gray-600 mb-4">Track your weight and measurements</p>
            <a
              href="/progress"
              className="block w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition-colors text-center"
            >
              View Progress
            </a>
          </div>

          {/* Analytics Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics</h2>
            <p className="text-gray-600 mb-4">View your fitness insights</p>
            <a
              href="/analytics"
              className="block w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition-colors text-center"
            >
              View Analytics
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
