import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ObjectId } from 'mongodb';
import { authOptions } from '../auth/[...nextauth]/route';
import clientPromise from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { date, meals, totalCalories, totalProtein, totalCarbs, totalFat } = data;

    if (!date || !meals || meals.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const nutrition = {
      userId: session.user?.email,
      date: new Date(date),
      meals,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('nutrition').insertOne(nutrition);

    return NextResponse.json(nutrition);
  } catch (error) {
    console.error('Error saving nutrition data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const nutrition = await db
      .collection('nutrition')
      .find({ userId: session.user?.email })
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(nutrition);
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, date, meals, totalCalories, totalProtein, totalCarbs, totalFat } = data;

    if (!id || !date || !meals || meals.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('nutrition').updateOne(
      {
        _id: new ObjectId(id),
        userId: session.user?.email,
      },
      {
        $set: {
          date: new Date(date),
          meals,
          totalCalories,
          totalProtein,
          totalCarbs,
          totalFat,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Nutrition entry not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Nutrition entry updated successfully' });
  } catch (error) {
    console.error('Error updating nutrition data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Nutrition entry ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('nutrition').deleteOne({
      _id: new ObjectId(id),
      userId: session.user?.email,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Nutrition entry not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Nutrition entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting nutrition data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
