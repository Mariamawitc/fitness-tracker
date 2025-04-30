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
    const { title, category, targetDate, targetValue, unit, notes } = data;

    if (!title || !category || !targetDate || !targetValue || !unit) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const goal = {
      userId: session.user?.email,
      title,
      category,
      targetDate: new Date(targetDate),
      targetValue,
      currentValue: 0,
      unit,
      notes,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('goals').insertOne(goal);

    return NextResponse.json(goal);
  } catch (error) {
    console.error('Error saving goal:', error);
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

    const goals = await db
      .collection('goals')
      .find({ userId: session.user?.email })
      .sort({ targetDate: 1 })
      .toArray();

    return NextResponse.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
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
    const {
      id,
      title,
      category,
      targetDate,
      targetValue,
      currentValue,
      unit,
      notes,
      completed,
    } = data;

    if (!id || !title || !category || !targetDate || !targetValue || !unit) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('goals').updateOne(
      {
        _id: new ObjectId(id),
        userId: session.user?.email,
      },
      {
        $set: {
          title,
          category,
          targetDate: new Date(targetDate),
          targetValue,
          currentValue,
          unit,
          notes,
          completed,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Goal not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Goal updated successfully' });
  } catch (error) {
    console.error('Error updating goal:', error);
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
        { error: 'Goal ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('goals').deleteOne({
      _id: new ObjectId(id),
      userId: session.user?.email,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Goal not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
