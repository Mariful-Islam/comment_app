import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import { Keyword } from '@/models/Keyword';

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { userId, post, platform, keyword, comments, messages } = await req.json();


    if (!userId || !post || !platform || !keyword || !comments || !messages) {
      return NextResponse.json(
        { message: 'All fields are required.' },
        { status: 400 }
      );
    }

    const newKeyword = await Keyword.create({ userId, post: {id: post?.id, text: post?.text }, platform, keyword, comments, messages, count: 0 });
    await newKeyword.save();

    return NextResponse.json(newKeyword, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
