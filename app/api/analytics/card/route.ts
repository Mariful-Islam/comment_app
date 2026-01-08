import { connectToDB } from "@/lib/mongodb";
import { Keyword } from "@/models/Keyword";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  try {
    await connectToDB()
    const userId = (await cookieStore).get("userId")?.value;
    console.log("User ID from cookie:", userId);
    
    const facebookReplyCount = await Keyword.find({ userId: userId, platform: "facebook"})
    const totalFacebookReplyCount = facebookReplyCount.reduce((acc, curr) => acc + (curr.count || 0), 0);   

    const instagramReplyCount = await Keyword.find({userId: userId, platform: "instagram"})
    const totalInstagramReplyCount = instagramReplyCount.reduce((acc, curr) => acc + (curr.count || 0), 0);   

    return NextResponse.json({facebookReplyCount: totalFacebookReplyCount, instagramReplyCount: totalInstagramReplyCount}, {status: 200}) 
  }
  catch{
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}   
    