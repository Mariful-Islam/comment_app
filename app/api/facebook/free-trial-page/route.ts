import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get("page_id");

    const cookieStore = cookies();

    const userId = (await cookieStore).get("userId")?.value;

    const user = await User.findById(userId);

    if (!pageId) {
      return NextResponse.json(
        { message: "Page ID is required" },
        { status: 400 }
      );
    }

    // 1. Check if ANY user has already claimed this specific pageId
    const existUserFreeTrialFb = await User.findOne({
      "isFreeTrial.facebook.page.id": pageId,
    });

    // STATE: PENDING (No record exists for this Page ID)

    if (!user?.isFreeTrial?.facebook?.page?.id) {
      return NextResponse.json({
        freeTrialFacebook: { status: "pending" },
      });
    }

    // If we reach here, a record WAS found. Let's extract the data.

    if (user?.isFreeTrial?.facebook?.page?.id) {
      const fbData = existUserFreeTrialFb?.isFreeTrial?.facebook;
      const startDate = fbData?.startDate;
      const endDate  = fbData?.endDate;
      const page = fbData?.page;

      // 2. Check if it's the SAME page (Running) or a DIFFERENT page (Assigned)
      if (page?.id === pageId) {
        // Check for Expiration
        if (new Date(endDate) <= new Date()) {
          return NextResponse.json({
            freeTrialFacebook: { status: "expired" },
          });
        }

        // STATE: RUNNING
        // Calculation for days left: (End - Now) / (ms * sec * min * hours)
        const daysLeft = Math.ceil(
          (new Date(endDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        );

        return NextResponse.json({
          freeTrialFacebook: {
            page: {
              id: page.id,
              name: page.name,
            },
            status: "running",
            freeTrialLeft: daysLeft > 0 ? daysLeft : 0,
          },
        });
      } else {
        // STATE: ASSIGNED (The pageId exists in DB but logic dictates it's handled as 'assigned')
        return NextResponse.json({
          freeTrialFacebook: {
            status: "assigned",
            message: `${
              page?.name || "Another page"
            } is already assigned for free trial!`,
          },
        });
      }
    }


  } catch (error) {
    console.error("Trial Check Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { pageId, pageName } = await req.json();

    await connectToDB();

    const cookieStore = cookies();
    const userId = (await cookieStore).get("userId")?.value;

    const user = await User.findById(userId);

    user.isFreeTrial.facebook.startDate = new Date();

    const currentDate = new Date();
    // Create a new date object based on the current one
    const afterSevenDays = new Date(currentDate);

    // Use setDate to update the day.
    // JavaScript handles month/year rollover automatically!
    afterSevenDays.setDate(currentDate.getDate() + 7);

    user.isFreeTrial.facebook.endDate = afterSevenDays;
    user.isFreeTrial.facebook.page.id = pageId;
    user.isFreeTrial.facebook.page.name = pageName;

    await user.save();

    return NextResponse.json({ data: "Facebook free trial data updated !" });
  } catch {
    return NextResponse.json({ data: "Facebook free trial error !" });
  }
}
