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
    const { weight, bodyFat, muscleMass, measurements, notes } = data;

    if (!weight && !bodyFat && !muscleMass && (!measurements || Object.keys(measurements).length === 0)) {
      return NextResponse.json(
        { error: 'At least one measurement is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const progress = {
      userId: session.user?.email,
      weight: weight ? parseFloat(weight) : undefined,
      bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
      muscleMass: muscleMass ? parseFloat(muscleMass) : undefined,
      measurements,
      notes,
      date: new Date(),
      createdAt: new Date(),
    };

    await db.collection('progress').insertOne(progress);

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error saving progress:', error);
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

    const progress = await db
      .collection('progress')
      .find({ userId: session.user?.email })
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
