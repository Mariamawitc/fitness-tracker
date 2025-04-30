import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AnalyticsData {
  workoutStats: Array<{
    _id: string;
    totalWorkouts: number;
    averageExercises: number;
  }>;
  nutritionStats: Array<{
    _id: string;
    averageCalories: number;
    averageProtein: number;
    averageCarbs: number;
    averageFat: number;
  }>;

}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError('Failed to load analytics');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">{error}</div>
    );
  }

  if (!data) {
    return null;
  }


  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Workout Progress</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.workoutStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalWorkouts"
              stroke="#8884d8"
              name="Total Workouts"
            />
            <Line
              type="monotone"
              dataKey="averageExercises"
              stroke="#82ca9d"
              name="Avg. Exercises"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Nutrition Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.nutritionStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="averageCalories"
              stroke="#8884d8"
              name="Avg. Calories"
            />
            <Line
              type="monotone"
              dataKey="averageProtein"
              stroke="#82ca9d"
              name="Avg. Protein"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>


    </div>
  );
}
