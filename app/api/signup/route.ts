// /app/api/signup/route.ts
import { NextRequest } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, imageUrl, authProvider } = await req.json();

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 });
    }

    await connectToDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashedPassword, imageUrl, authProvider });

    return Response.json({ message: 'User created', userId: newUser._id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
