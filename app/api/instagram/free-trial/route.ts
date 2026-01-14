import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest){
    
    try {
        const cookieStore = cookies()
        const instaAccessToken = (await cookieStore).get('insta_access_token')?.value
        if(!instaAccessToken){
            return NextResponse.json({data: "Instagram Access Token not found !!"}, {status: 401})
        }

        const instaUserId = (await cookieStore).get('instaUserId')?.value
        if(!instaUserId){
            return NextResponse.json({data: "Instagram User ID not found !!!"}, {status: 401})
        }


        const res = await fetch(`https://graph.instagram.com/v24.0/${instaUserId}/subscribed_apps?access_token=${instaAccessToken}`)
        const data = await res.json()


        const isSubscribed = data?.data[0]?.subscribed_fields.map((field:string)=>field==="comments")[0]

        return NextResponse.json({data: {isSubscribed: isSubscribed}})


    } catch {
        return NextResponse.json({data: "Error in checking subscription !"}, {status: 401})
    }
}




export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ data: "User ID not found" }, { status: 401 });
    }

    await connectToDB();

    // 1. Logic to update trial if it doesn't exist or start it now
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 7); // Correct way to add 7 days

    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ data: "User not found" }, { status: 404 });
    }

    // Only set trial dates if they haven't been set yet
    if (!user.isFreeTrial?.instagram?.startDate) {
      user.isFreeTrial.instagram = {
        startDate: startDate,
        endDate: endDate,
      };
      await user.save();
      console.log("Trial started:", startDate);
    }

    // 2. Access Token Checks
    const instaAccessToken = cookieStore.get("insta_access_token")?.value;
    const instaUserId = cookieStore.get("instaUserId")?.value;

    if (!instaAccessToken || !instaUserId) {
      return NextResponse.json(
        { data: "Instagram credentials missing!" },
        { status: 401 }
      );
    }

    // 3. Instagram Graph API Call
    const res = await fetch(
      `https://graph.instagram.com/v24.0/${instaUserId}/subscribed_apps?subscribed_fields=comments&access_token=${instaAccessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { data: "Instagram API error", error: data },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Subscription Error:", error);
    return NextResponse.json(
      { data: "Internal Server Error" },
      { status: 500 }
    );
  }
}





export async function DELETE(req: NextRequest){
    
    try {
        const cookieStore = cookies()
        const instaAccessToken = (await cookieStore).get('insta_access_token')?.value
        if(!instaAccessToken){
            return NextResponse.json({data: "Instagram Access Token not found !!"}, {status: 401})
        }

        const instaUserId = (await cookieStore).get('instaUserId')?.value
        if(!instaUserId){
            return NextResponse.json({data: "Instagram User ID not found !!!"}, {status: 401})
        }

        console.log(instaUserId)
        

        const res = await fetch(`https://graph.instagram.com/v24.0/${instaUserId}/subscribed_apps?subscribed_fields=comments&access_token=${instaAccessToken}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()

        return NextResponse.json(data)


    } catch {
        return NextResponse.json({data: "Error in checking subscription !"}, {status: 401})
    }
}