// instagram auth callback route
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Instagram } from "@/models/Instagram";
import { useUser } from "@/contexts/UserContext";

export async function POST(req: NextRequest) {
    const {user} = useUser();
  try {
    await connectToDB();
    const { name, email, expires, image, accessToken } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "No Instagram account connected!" },
        { status: 400 }
      );
    }

    const instagramInstance = await Instagram.findOne({ email });

    if (!instagramInstance) {
      const instance = await Instagram.create({
        userEmail: user?.email,
        name,
        email,
        image,
        expires: new Date(expires),
        accessToken,
      });
      instance.save();
      return NextResponse.json(instance, { status: 201 });
    }
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
