import Token from "@/components/Token";
import { Facebook } from "@/models/Facebook";
import { FacebookPage } from "@/models/FacebookPage";
import { Keyword } from "@/models/Keyword";
import { KeywordUsage } from "@/models/KeywordUsage";
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
    console.log("📬 Webhook event:");

    for (const entry of body.entry ?? []) {
      const pageId = entry?.id;

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
          const { comment_id, post_id, message, sender_id, from } = change.value;



          console.log(`New comment on post ${post_id}: ${message} (Comment ID: ${comment_id})`);

          const words = message.trim().split(/\s+/).map((w:any) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // escape regex chars
    
          const regex = new RegExp(`\\b(${words.join('|')})\\b`, 'i');
  
          const keywordEntry = await Keyword.findOne({ "post.id": post_id, keyword: { $regex: regex } });


          console.log("Matched Keyword Entry:", keywordEntry);
          



          let replyComment = "Thanks for reaching out!";
          let replyMessage = "Thank you for your comment!";

          if (keywordEntry?.isActive) {
            // Randomly pick from the comments array
            if (keywordEntry?.comments && keywordEntry?.comments?.length > 0) {
              const randomCommentIdx = Math.floor(Math.random() * keywordEntry?.comments?.length);
              replyComment = keywordEntry.comments[randomCommentIdx];
            }

            // Randomly pick from the messages array
            if (keywordEntry?.messages && keywordEntry?.messages?.length > 0) {
              const randomMessageIdx = Math.floor(Math.random() * keywordEntry?.messages?.length);
              replyMessage = keywordEntry?.messages[randomMessageIdx];
            }
          }

          // 📨 Private reply (Inbox)
          if (replyComment && replyMessage && comment_id && keywordEntry?.isActive) {

            await new Promise((r) => setTimeout(r, 15000)); // slight delay to ensure comment is posted before replying
            
            const commentRes = await fetch(
              `https://graph.facebook.com/v23.0/${comment_id}/comments?access_token=${pageAccessToken}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: `Hi ${from?.name}, ${replyComment}` }),
              }
            );

            if(commentRes.ok) { 
              console.log("💬 Comment reply sent")
            } ;


            await new Promise((r) => setTimeout(r, 30000));
            
            const messageRes = await fetch(
              `https://graph.facebook.com/v23.0/me/messages?access_token=${pageAccessToken}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  recipient: { comment_id },
                  message: { text: `Hi ${from?.name}, ${replyMessage}` },
                }),
              }
            );

            if(messageRes.ok) {
              console.log("✉️  Message reply sent")
            }


            if (commentRes.ok && messageRes.ok) {
              const messageData = await messageRes.json();
              keywordEntry.count = (keywordEntry.count || 0) + 1;
              await keywordEntry.save();

              const keywordUsage = await KeywordUsage.create({
                userId: keywordEntry?.userId,
                postId: post_id,
                keyword: {
                  id: keywordEntry?._id,
                  text: keywordEntry?.keyword,
                },
                target: {
                  id: from?.id,
                  name: from?.name,
                },
                platform: "facebook",
                commentReply: replyComment,
                messageReply: replyMessage,
              });

              await keywordUsage.save();

            }
          }
        }
      }
    }

    return NextResponse.json({ status: "EVENT_RECEIVED" });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
