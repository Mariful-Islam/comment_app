import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const fbAccessToken = (await cookieStore).get("fb_access_token")?.value;

  if (!fbAccessToken) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  return NextResponse.json({ fb_access_token: fbAccessToken });
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