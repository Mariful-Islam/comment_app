import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const tokenUrl = new URL("https://graph.facebook.com/v23.0/oauth/access_token");
  tokenUrl.searchParams.set("client_id", process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID!);
  tokenUrl.searchParams.set("client_secret", process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET!);
  tokenUrl.searchParams.set("redirect_uri", process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI!);
  tokenUrl.searchParams.set("code", code);

  // Exchange code for access token
  const tokenRes = await fetch(tokenUrl.toString());
  const tokenData = await tokenRes.json();

  if (tokenData.error) {
    return NextResponse.json({ error: tokenData.error }, { status: 400 });
  }

  const userAccessToken = tokenData.access_token;

  // Fetch Pages (need pages_show_list)
  const pagesRes = await fetch(
    `https://graph.facebook.com/v23.0/me/accounts?access_token=${userAccessToken}`
  );

  const pages = await pagesRes.json();

  // return NextResponse.json({
  //   access_token: userAccessToken,
  //   pages, // includes page id + page access token
  // });
    // Store tokens in cookies or localStorage (optional)
  const response = NextResponse.redirect(new URL('/', req.url)); // redirect to home page
  response.cookies.set("fb_access_token", userAccessToken, { path: "/", httpOnly: true });
  // You could also store page info if needed

  return response;
}
