import { connectToDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

// Mock user data for demonstration purposes

export async function GET(req: NextRequest) {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    

    if (!email) {
        return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    
    console.log("User found:", user);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
}



