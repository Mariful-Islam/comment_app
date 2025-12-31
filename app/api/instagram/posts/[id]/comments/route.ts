import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


type Params = Promise<{ id: number }>


export async function GET(req: NextRequest, { params }: { params: Params } ) {
  const { id } = await params


  if (!id) {
    return NextResponse.json({ error: "Media ID is missing" }, { status: 400 });
  }
  
  const cookieStore = cookies();
  const instaAccessToken = (await cookieStore).get("insta_access_token")?.value;


  const res = await fetch(
    `https://graph.instagram.com/v21.0/${id}/comments?fields=id,text,timestamp,username,like_count&access_token=${instaAccessToken}`
  );
  const data = await res.json();

  if (!instaAccessToken) {
    return NextResponse.json(
      { error: "No instagram Access token found" },
      { status: 401 }
    );
  }

  return NextResponse.json(data);
}
