// /api/facebook/callback
export async function GET(req:any) {
  const code = new URL(req.url).searchParams.get("code");

  const tokenRes = await fetch(
    `https://graph.facebook.com/v23.0/oauth/access_token?` +
      `client_id=${process.env.FACEBOOK_CLIENT_ID}` +
      `&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}` +
      `&redirect_uri=http://localhost:3000/api/facebook/callback` +
      `&code=${code}`
  );

  const tokenData = await tokenRes.json();
  return Response.json(tokenData);
}
