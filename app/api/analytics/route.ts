import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import clientPromise from '@/lib/db';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Get workout statistics
    const workoutStats = await db.collection('workouts').aggregate([
      { $match: { userId: session.user?.email } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          totalWorkouts: { $sum: 1 },
          averageExercises: { $avg: { $size: "$exercises" } }
        }
      },
      { $sort: { "_id": 1 } }
    ]).toArray();

    // Get nutrition statistics
    const nutritionStats = await db.collection('nutrition').aggregate([
      { $match: { userId: session.user?.email } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          averageCalories: { $avg: "$totalCalories" },
          averageProtein: { $avg: "$totalProtein" },
          averageCarbs: { $avg: "$totalCarbs" },
          averageFat: { $avg: "$totalFat" }
        }
      },
      { $sort: { "_id": 1 } }
    ]).toArray();

    return NextResponse.json({
      workoutStats,
      nutritionStats
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
