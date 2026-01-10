import { connectToDB } from "@/lib/mongodb";
import { Keyword } from "@/models/Keyword";
import { KeywordUsage } from "@/models/KeywordUsage";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { Types } from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    /**
     * 1. BUILD THE MATCH QUERY
     * Since your JSON shows userId as a string, we query by string.
     * If your DB actually uses ObjectIds, use: new Types.ObjectId(userId)
     */
    const matchQuery: any = {
      $or: [
        { userId: userId },
        { userId: new Types.ObjectId(userId) }, // Handles both cases to be safe
      ],
    };

    /**
     * 2. DATE FILTERING
     */
    if (start || end) {
      // Initialize the createdAt object
      matchQuery.createdAt = {};

      if (start) {
        const startDate = new Date(start); // Convert string "2026-01-10" to Date object
        if (!isNaN(startDate.getTime())) {
          // Set to start of day (00:00:00)
          startDate.setUTCHours(0, 0, 0, 0);
          matchQuery.createdAt.$gte = startDate.toISOString().replace('Z', '+00:00');
        }
      }

      if (end) {
        const endDate = new Date(end);
        if (!isNaN(endDate.getTime())) {
          // Set to end of day (23:59:59)
          endDate.setUTCHours(23, 59, 59, 999);
          matchQuery.createdAt.$lte = endDate.toISOString().replace('Z', '+00:00');
        }
      }

      // CRITICAL: If start/end were invalid, remove the empty createdAt object
      if (Object.keys(matchQuery.createdAt).length === 0) {
        delete matchQuery.createdAt;
      }
    }
    


    console.log("Final Match Query:", JSON.stringify(matchQuery, null, 2));

    /**
     * 3. EXECUTE AGGREGATION
     */
    const stats = await KeywordUsage.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$platform", // Groups by "facebook", "instagram", etc.
          totalCount: { $sum: 1 },
        },
      },
    ]);

    /**
     * 4. FORMAT OUTPUT
     * Ensures you get a clean object like { facebook: 10, instagram: 5 }
     */
    const result = stats.reduce(
      (acc, curr) => {
        if (curr._id) {
          acc[curr._id.toLowerCase()] = curr.totalCount;
        }
        return acc;
      },
      { facebook: 0, instagram: 0 } as Record<string, number>
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Aggregation Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
