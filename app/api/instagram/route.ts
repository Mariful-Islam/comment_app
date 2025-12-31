import { connectToDB } from "@/lib/mongodb";
import { Facebook } from "@/models/Facebook";
import { FacebookPage } from "@/models/FacebookPage";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest){
  try {
    await connectToDB()
    const {searchParams} = new URL(req.url)
    const email = searchParams.get('email')

    if(!email) {
      return Response.json({message: "No facebook account connected!"}, {status: 400})
    }

    const facebookInstance = await Facebook.findOne({email})
    return Response.json(facebookInstance, {status: 200}) 
  }
  catch{
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}



export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const {
      userEmail,
      name,
      email,
      expires,
      image,
      accessToken,
    } = await req.json();

    // ✅ Proper validation
    if (
      (!userEmail && !email) ||
      !name ||
      !expires ||
      !accessToken ||
      !image
    ) {
      return NextResponse.json(
        { error: "Facebook auth data not available!" },
        { status: 400 }
      );
    }

    // ✅ Check if Facebook auth already exists
    let facebookAuth = await Facebook.findOne({ email });

    if (facebookAuth) {
      facebookAuth.accessToken = accessToken;
      facebookAuth.expires = expires;
      await facebookAuth.save();

      return NextResponse.json(
        { message: "Access Token updated!" },
        { status: 200 }
      );
    }

    // ✅ Create Facebook auth
    facebookAuth = await Facebook.create({
      userEmail,
      name,
      email,
      image,
      expires,
      accessToken,
    });

    // ✅ Fetch Facebook Pages
    const pagesRes = await fetch(
      `https://graph.facebook.com/v23.0/me/accounts?access_token=${accessToken}`
    );

    const pagesData = await pagesRes.json();

    if (pagesData?.data?.length) {
      for (const page of pagesData.data) {
        await FacebookPage.findOneAndUpdate(
          { id: page.id },
          {
            id: page.id,
            pageAccessToken: page.access_token,
            name: page.name,
            ownerId: facebookAuth._id,
            ownerAccessToken: accessToken,
            ownerName: name,
          },
          { upsert: true, new: true }
        );
      }
    }

    return NextResponse.json(
      { message: "Your Facebook account is connected!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Facebook Auth Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
