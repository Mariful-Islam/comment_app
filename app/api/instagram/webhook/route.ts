import { Keyword } from "@/models/Keyword";
import { NextRequest, NextResponse } from "next/server";
import { text } from "stream/consumers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const challenge = searchParams.get("hub.challenge");
  const verifyToken = searchParams.get("hub.verify_token");

  // 🔐 Must match the token you set in Meta Dashboard
  const EXPECTED_TOKEN = process.env.INSTAGRAM_VERIFY_TOKEN;

  if (mode === "subscribe" && verifyToken === EXPECTED_TOKEN) {
    // ✅ REQUIRED: return challenge as plain text
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}





export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Check if this is a standard Webhook notification
    const entry = body.entry?.[0];
    if (!entry || !entry.changes) {
      return NextResponse.json({ message: "No changes found" }, { status: 200 });
    }

    for (const change of entry.changes) {
      // 2. Ensure we are handling a comment field
      if (change.field === "comments") {
        const { id: commentId, text: message, from } = change.value;
        const recipientId = from.id; // The ID of the person who commented

        // Skip if the comment is from your own account to avoid infinite loops
        // Replace 'YOUR_INSTAGRAM_USERNAME' with your actual handle
        if (from.username === "YOUR_INSTGRAM_USERNAME") continue;

        const commentText = change.value.text.toLowerCase();
        const postId = change?.value?.media?.id;


        const matchKeyword = await Keyword.findOne({ postId: postId, keyword: { $regex: `\\b${commentText}\\b` } });



        const accessToken = "IGAALoV9MO92xBZAFpzUFVuTWczZA2tZAeTk5MElYOWtjaFk4S1YtQjFUbWJMM1N1T0ZAUY2gwcEV0cUl3MzNwNkhXU2VvcDZAydGw5QVhnVFpKVVdBOUJWMlhkUzlyamJ2RGg0TXlmbl9jZATJPaV9BMmlBTjBVajhqRE9QRFZA4X3hJOAZDZD"
        
        // Note: Graph API v23.0 is a future version; usually, you'll use the current stable (v18.0 - v20.0)

        if(!matchKeyword) {
          return NextResponse.json({ message: "No matching keyword found" }, { status: 200 });
        }


        if(matchKeyword?.message && matchKeyword?.comment && matchKeyword?.isActive) {


          const commentApiUrl = `https://graph.instagram.com/v20.0/${commentId}/replies`;

          const commentResponse = await fetch(commentApiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: matchKeyword?.comment || "",
              access_token: accessToken,
            }),
          });

          const result = await commentResponse.json();

          if (!commentResponse.ok) {
            console.error("Meta API Error:", result);
          } else {
            console.log("Reply posted successfully:");
          }


          const messageApiUrl = `https://graph.instagram.com/v20.0/me/messages`;

          const messageResponse = await fetch(messageApiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              recipient: { comment_id: commentId },
              message: { text: matchKeyword?.message || "" },
              access_token: accessToken,
            }),
          });

          const messageResult = await messageResponse.json();

          if (!messageResponse.ok) {
            console.error("DM Error:", messageResult);
          } else {
            console.log("DM sent successfully ");
          }
        }
      }
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Webhook Handler Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}