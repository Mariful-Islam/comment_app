import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const fbAccessToken = (await cookieStore).get("insta_access_token")?.value;

  const res = await fetch(
    `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=IGAALoV9MO92xBZAFl6ZAk9jakk3c3FJVTUzYjgxSmVONEppaE5TQUpuWHRnQXhteVc5SGN2YWVZAZAUFySkNCMk04NC0zVWREVEdWX1UyTTNrdHdqcmJKaXQxcjZAxTlFXZAXI4VkZAYOEJjRi03VmJaYURlRjBJcm9Id0wzanhYVy1FcwZDZD`,
    { cache: "no-cache" }
  );

  const data = await res.json()


  if (!fbAccessToken) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  return NextResponse.json(data);
}








