import { connectToDB } from "@/lib/mongodb";
import { Facebook } from "@/models/Facebook";
import { NextRequest } from "next/server";


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

    const { userEmail, name, email, expires, image, accessToken } = await req.json();

    // Validate required fields
    if (!userEmail && !email || !name || !expires || !accessToken || !image) {
      return Response.json(
        { error: "Facebook auth data not available!" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existFacebookAuth = await Facebook.findOne({ email });

    if (existFacebookAuth) {
      existFacebookAuth.accessToken = accessToken;
      await existFacebookAuth.save();
      return Response.json(
        { message: "Access Token updated!" },
        { status: 200 }
      );
    } else {
      await Facebook.create({
        userEmail,
        name,
        email,
        image,
        expires,
        accessToken,
      });

      return Response.json({
        message: "Your Facebook account is connected!",
        status: 200
      });
    }
  } catch (err) {
    console.error("Facebook Auth Error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
