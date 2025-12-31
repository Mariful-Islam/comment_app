// app/api/webhook/route.js
import { NextResponse } from "next/server";

/**
 * Facebook Webhook Verification (GET)
 */
export async function GET(req:any) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN_TEST) {
    console.log("✅ Webhook verified successfully!");
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

/**
 * Facebook Webhook Event Handler (POST)
 */
export async function POST(req:any) {
  const body = await req.json();
  console.log("📩 Incoming webhook event:");

  if (body.object === "page") {
    for (const entry of body.entry) {
      const changes = entry.changes || [];

      for (const change of changes) {
        const comment = change.value?.message;
        const commentId = change.value?.comment_id;
        const userId = change.value?.from?.id;

        if (comment && comment.toLowerCase().includes("price")) {
          console.log(`💬 Detected "price" keyword from user`);

          const messageSent = await sendMessageToUser(userId);

          if (!messageSent && commentId) {
            console.log("⚠️ DM failed — replying as a comment instead");
            await sendCommentReply(commentId);
          }
        }
      }
    }
  }

  return new NextResponse("EVENT_RECEIVED", { status: 200 });
}

/**
 * Try sending private Messenger message to user
 */
async function sendMessageToUser(userId:any) {
  try {
    // 1️⃣ Get the PSID (Page Scoped ID)
    const psidRes = await fetch(
      `https://graph.facebook.com/v19.0/${userId}/ids_for_pages?access_token=${process.env.FB_PAGE_ACCESS_TOKEN}`
    );
    const psidData = await psidRes.json();

    const psid = psidData.data?.[0]?.id;
    if (!psid) {
      console.error("❌ Could not get PSID:", psidData);
      return false;
    }

    // 2️⃣ Send message via Messenger
    const messageData = {
      recipient: { id: psid },
      message: { text: "Price is 2200 tk 💰" },
    };

    const sendRes = await fetch(
      `https://graph.facebook.com/v19.0/me/messages?access_token=${process.env.FB_PAGE_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      }
    );

    const sendData = await sendRes.json();
    console.log("📤 Message sent response:");

    return !!sendData.recipient_id;
  } catch (err) {
    console.error("🚨 Error sending message:", err);
    return false;
  }
}

/**
 * Fallback: reply as a public comment
 */
async function sendCommentReply(commentId:any) {
  try {
    const replyMessage = "Price is 2200 tk 💰";

    const res = await fetch(
      `https://graph.facebook.com/v19.0/${commentId}/comments?access_token=${process.env.FB_PAGE_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMessage }),
      }
    );

    const data = await res.json();
    console.log("💬 Comment reply sent:");
  } catch (err) {
    console.error("🚨 Error sending comment reply:", err);
  }
}
