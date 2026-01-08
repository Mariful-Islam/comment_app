import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const instaAccessToken = (await cookieStore).get("insta_access_token")?.value;
  console.log("Insta Access Token:", instaAccessToken);

  const res = await fetch(
    `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${instaAccessToken}`,
    { cache: "no-cache" }
  );

  const data = await res.json()


  if (!instaAccessToken) {
    return NextResponse.json({ error: "No instagram Access token found" }, { status: 401 });
  }

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const cookieStore = cookies();

  // Delete the cookie
  (await cookieStore).delete("fb_access_token");

  return NextResponse.json(
    { message: "fb_access_token cookie deleted" },
    { status: 200 }
  );
}
