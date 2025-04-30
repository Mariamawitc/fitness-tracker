import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/db';

export async function GET() {
  try {
    // Test the connection
    const client = await clientPromise;
    await client.db("admin").command({ ping: 1 });
    
    return NextResponse.json({ 
      status: "success", 
      message: "Successfully connected to MongoDB!" 
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ 
      status: "error", 
      message: "Failed to connect to MongoDB", 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
