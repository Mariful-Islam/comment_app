import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Keyword } from "@/models/Keyword";

export async function GET(_req: Request, { params }: { params: any }) {
  try {
    await connectToDB();

    const { userId } = await params;

    // 1. Extract query parameters
    const { searchParams } = new URL(_req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // 2. Execute queries in parallel for better performance
    const [keywords, totalCount] = await Promise.all([
      Keyword.find({ userId: userId })
        .sort({ createdAt: -1 }) // Usually helpful to show newest first
        .skip(skip)
        .limit(limit),
      Keyword.countDocuments({ userId: userId }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    // 3. Return data + pagination metadata
    return NextResponse.json(
      {
        data: keywords,
        meta: {
          totalCount,
          totalPages,
          currentPage: page,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
