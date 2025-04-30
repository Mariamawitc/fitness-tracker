import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "../../../../lib/db";

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if user exists
    const existingUser = await db.collection("users").findOne({ email });
    
    if (existingUser) {
      // If user exists but has no password (Google login), allow adding password
      if (!existingUser.password) {
        const hashedPassword = await bcrypt.hash(password, 12);
        await db.collection("users").updateOne(
          { email },
          {
            $set: {
              password: hashedPassword,
              updatedAt: new Date(),
            },
          }
        );
        return NextResponse.json(
          { message: "Password added successfully" },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with proper fields for NextAuth
    const result = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      name: name || email.split("@")[0],
      image: null,
      emailVerified: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error creating user" },
      { status: 500 }
    );
  }
}
