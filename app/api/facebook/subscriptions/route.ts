

import { connectToDB } from "@/lib/mongodb";
import { FacebookPage } from "@/models/FacebookPage";
import { User } from "@/models/User";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDB();

  const user = await User.findById(userId);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Pagination parameters
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10");
  const skip =      
    (page - 1) * limit;

  // Get Facebook Subscriptions for the user
  const facebookSubscriptions = user.subscriptions?.facebook || []; 
    const paginatedSubscriptions = facebookSubscriptions.slice(skip, skip + limit); 
    return NextResponse.json({  
        subscriptions: paginatedSubscriptions,  
        total: facebookSubscriptions.length,  
        page,  
        totalPages: Math.ceil(facebookSubscriptions.length / limit) 
    });
}