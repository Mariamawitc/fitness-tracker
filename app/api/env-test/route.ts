import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    hasMongoUri: !!process.env.MONGODB_URI,
    mongoUri: process.env.MONGODB_URI?.substring(0, 20) + '...' // Only show the beginning for security
  });
}
