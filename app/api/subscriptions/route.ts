import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  // 1. Get Pagination Params from URL
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  await connectToDB();
  const user = await User.findById(userId);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let fullList = [];

  // Map Facebook Subscriptions
  const facebookPages = user?.subscriptions?.facebook || [];
  for (const page of facebookPages) {
    fullList.push({
      target: { id: page?.page?.id, name: page?.page?.name },
      startDate: page?.startDate,
      endDate: page?.endDate,
      status: page?.status,
      isPaid: page?.isPaid,
      platform: "facebook",
      payment: page?.payment
    });
  }

  // Map Instagram Subscriptions
  const instagram = user?.subscriptions?.instagram || [];
  for (const item of instagram) {
    fullList.push({
      target: { id: item?.user?.id, name: item?.user?.username },
      startDate: item?.startDate,
      endDate: item?.endDate,
      status: item?.status,
      isPaid: item?.isPaid,
      platform: "instagram",
      payment: item?.payment

    });
  }

  // 2. Calculate Pagination Metadata
  const totalCount = fullList.length;
  const totalPages = Math.ceil(totalCount / limit);

  // 3. Slice the array for the current page
  const paginatedData = fullList.slice(skip, skip + limit);

  return NextResponse.json({
    data: paginatedData,
    meta: {
      totalCount,
      totalPages,
      currentPage: page,
      limit,
    },
  });
}








export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies(); // Await cookies in Next.js 15+
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const { page, platform, user: instaUser } = await req.json();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Handle Dates properly
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);

    if (platform === "instagram") {
      // Ensure the sub-object exists before pushing
      if (!user.subscriptions) user.subscriptions = {};
      if (!user.subscriptions.instagram) user.subscriptions.instagram = [];

      user.subscriptions.instagram.push({
        user: instaUser,
        startDate: startDate,
        endDate: endDate,
        status: "pending",
        isPaid: false,
      });

      // IMPORTANT: Save the changes to the database
      await user.save();

      return NextResponse.json({
        data: "Subscription for instagram created successfully",
      });
    }

    if (platform === "facebook") {
      // Ensure the sub-object exists before pushing
      if (!user.subscriptions) user.subscriptions = {};
      if (!user.subscriptions.facebook) user.subscriptions.facebook = [];

      user.subscriptions.facebook.push({
        page: page,
        startDate: startDate,
        endDate: endDate,
        status: "pending",
        isPaid: false,
      });

      // IMPORTANT: Save the changes to the database
      await user.save();

      return NextResponse.json({
        data: "Subscription for facebook created successfully",
      });
    }

    return NextResponse.json(
      { data: "Platform not supported" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Subscription Error:", error);
    return NextResponse.json(
      { data: "Error in creating subscription!" },
      { status: 500 } // Use 500 for server errors
    );
  }
}





export async function PATCH(req: NextRequest) {
  try {
    const { payment, instagram, facebook } = await req.json();
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;


    console.log(payment, "lkkkkkkkkkkkkkkk")

    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    if (!payment || !payment.method || !payment.trxId) {
      return NextResponse.json({ error: "Payment details missing (TrxID required)" }, { status: 400 });
    }

    await connectToDB();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30); // 30-day subscription

    const paymentDetails = {
      method: payment.method,
      trxId: payment.trxId,
      amount: payment?.amount,
      paidAt: new Date(),
    };

    // Handle Facebook Subscription
    if (facebook) {
      user.subscriptions.facebook.push({
        page: {
          id: facebook.id,
          name: facebook.name,
        },
        startDate,
        endDate,
        status: "running", // Pending admin verification of TrxID
        isPaid: true,
        payment: paymentDetails,
      });
    }

    // Handle Instagram Subscription
    if (instagram) {
      user.subscriptions.instagram.push({
        user: {
          id: instagram.id,
          username: instagram.username,
        },
        startDate,
        endDate,
        status: "running",
        isPaid: true,
        payment: paymentDetails,
      });
    }

    await user.save();

    return NextResponse.json({ message: "Subscription submitted successfully!" }, { status: 200 });
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}