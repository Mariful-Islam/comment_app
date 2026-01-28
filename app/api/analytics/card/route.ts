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

    // if (start || end) {
    //   matchQuery.createdAt = {};

    //   if (start) {
    //     const startDate = new Date(start);
    //     if (!isNaN(startDate.getTime())) {
    //       startDate.setUTCHours(0, 0, 0, 0);
    //       // Pass the Date object directly, NOT .toISOString()
    //       matchQuery.createdAt.$gte = startDate;
    //     }
    //   }

    //   if (end) {
    //     const endDate = new Date(end);
    //     if (!isNaN(endDate.getTime())) {
    //       endDate.setUTCHours(23, 59, 59, 999);
    //       // Pass the Date object directly, NOT .toISOString()
    //       matchQuery.createdAt.$lte = endDate;
    //     }
    //   }

    //   if (Object.keys(matchQuery.createdAt).length === 0) {
    //     delete matchQuery.createdAt;
    //   }
    // }

    console.log("Final Match Query:", JSON.stringify(matchQuery, null, 2));

    /**
     * 3. EXECUTE AGGREGATION
     */
    // Inside your GET handler
    const stats = await KeywordUsage.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { $toLower: "$platform" }, // Directly handle casing in Mongo
          totalCount: { $sum: 1 },
        },
      },
    ]);

    // Final formatted data
    const result = {
      facebook: 0,
      instagram: 0,
      total: 0,
    };

    stats.forEach((item) => {
      if (item._id === "facebook" || item._id === "instagram") {
        result[item._id as "facebook" | "instagram"] = item.totalCount;
        result.total += item.totalCount;
      }
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Aggregation Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
