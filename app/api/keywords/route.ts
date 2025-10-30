import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import { Keyword } from '@/models/Keyword';

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { postId, keyword, message } = await req.json();


    if (!postId || !keyword || !message) {
      return NextResponse.json(
        { message: 'All fields are required.' },
        { status: 400 }
      );
    }

    const newKeyword = await Keyword.create({ postId, keyword, message });

    return NextResponse.json(newKeyword, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
