import { connectToDB } from "@/lib/mongodb";
import { KeywordUsage } from "@/models/KeywordUsage";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectToDB();
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    console.log("Fetching keyword usage for user:", userId);

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 1. Extract query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    
    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // 2. Execute queries in parallel for better performance
    const [keywords, totalCount] = await Promise.all([
      KeywordUsage.find({ userId: userId })
        .sort({ createdAt: -1 }) // Usually helpful to show newest first
        .skip(skip)
        .limit(limit),
      KeywordUsage.countDocuments({ userId: userId })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    // 3. Return data + pagination metadata
    return NextResponse.json({
      data: keywords,
      meta: {
        totalCount,
        totalPages,
        currentPage: page,
        limit
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}