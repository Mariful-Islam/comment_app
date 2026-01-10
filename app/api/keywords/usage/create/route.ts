import { connectToDB } from "@/lib/mongodb";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";



// here is the keyword usage model

//     userId: string;
//     postId: string;
//     keyword: {
//         id: string;
//         text: string;
//     };
//     target: {
//         id: string;
//         name: string;
//     };
//     platform: 'facebook' | 'instagram';
//     commentReply: string;
//     messageReply: string;


export async function POST(req: Request) {
  try {
    await connectToDB();
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { postId, keyword, target, platform, commentReply, messageReply } = await req.json();

    const newKeywordUsage = new KeywordUsage({
      userId,
      postId,
      keyword,
      target,
      platform,
      commentReply,
      messageReply
    });

    await newKeywordUsage.save();   
    



    return NextResponse.json({ message: 'Keyword usage recorded successfully' }, { status: 201 });
    } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}import { KeywordUsage } from "@/models/KeywordUsage";