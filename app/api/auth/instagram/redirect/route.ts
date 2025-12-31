import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID!,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
        grant_type: "authorization_code",
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!,
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      return NextResponse.json(tokenData, { status: 400 });
    }

    const { access_token, user_id } = tokenData;

    // Optional: Fetch user profile
    const profileRes = await fetch(
      `https://graph.instagram.com/${user_id}?fields=id,username&access_token=${access_token}`
    );
    const profile = await profileRes.json();

    // TODO: Save token/profile to DB or session

    return NextResponse.redirect(
      new URL(`/dashboard?username=${profile.username}`, req.url)
    );

  } catch (error) {
    return NextResponse.json({ error: "Instagram auth failed" }, { status: 500 });
  }
}
