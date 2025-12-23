import Token from "@/components/Token";
import { Facebook } from "@/models/Facebook";
import { FacebookPage } from "@/models/FacebookPage";
import { Keyword } from "@/models/Keyword";
import { User } from "@/models/User";
import { constants } from "buffer";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Facebook webhook verification
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  const VERIFY_TOKEN = "1234";

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WEBHOOK VERIFIED");
    return new NextResponse(challenge, { status: 200 });
  } else {
    console.warn("❌ Verification failed");
    return new NextResponse("Forbidden", { status: 403 });
  }
}



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📬 Webhook event:", JSON.stringify(body, null, 2));

    for (const entry of body.entry ?? []) {
      const pageId = entry.id;

      // 🔑 Get Page Access Token from DB
      const pageRecord = await FacebookPage.findOne({ id: pageId });

      if (!pageRecord) {
        console.warn(`⚠️ No page token stored for page ${pageId}`);
        continue;
      }

      const pageAccessToken = pageRecord.pageAccessToken;

      for (const change of entry.changes ?? []) {
        if (
          change.field === "feed" &&
          change.value?.item === "comment" &&
          change.value?.from?.id !== pageId
        ) {
          const { comment_id, post_id, message, sender_id } = change.value;

          console.log(`💬 Comment from ${sender_id}: ${message}`);

          const keywordEntry = await Keyword.findOne({ postId: post_id });

          const replyMessage =
            keywordEntry?.message || "Thank you for your comment!";
          const replyComment = keywordEntry?.comment;

          // 📨 Private reply (Inbox)
          if (replyMessage && comment_id && keywordEntry?.isActive) {
            await fetch(
              `https://graph.facebook.com/v23.0/me/messages?access_token=${pageAccessToken}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  recipient: { comment_id },
                  message: { text: replyMessage },
                }),
              }
            );
          }

          // 💬 Public comment reply
          if (replyComment && comment_id && keywordEntry?.isActive) {
            await fetch(
              `https://graph.facebook.com/v23.0/${comment_id}/comments?access_token=${pageAccessToken}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: replyComment }),
              }
            );
          }

          console.log("✅ Replies sent");
        }
      }
    }

    return NextResponse.json({ status: "EVENT_RECEIVED" });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
