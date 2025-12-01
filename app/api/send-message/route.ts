import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

  if (!PAGE_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: "Missing PAGE_ACCESS_TOKEN" },
      { status: 500 }
    );
  }

  try {
    const { recipientId, message }: { recipientId: string; message: string } =
      await req.json();

    if (!recipientId || !message) {
      return NextResponse.json(
        { error: "Missing recipientId or message" },
        { status: 400 }
      );
    }

    const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

    const body = {
      recipient: { id: recipientId },
      message: { text: message },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Facebook API error:", data);
      return NextResponse.json({ error: data }, { status: res.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Error sending message:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
