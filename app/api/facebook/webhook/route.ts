import { connectToDB } from "@/lib/mongodb";
import { FacebookPage } from "@/models/FacebookPage";
import { Keyword } from "@/models/Keyword";
import { KeywordUsage } from "@/models/KeywordUsage";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// Utility helper to halt execution for a set timeframe
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 🛠️ Background Processing Engine
 * Handles lookup, verification, delays, and API responses outside the main thread.
 * This ensures Meta receives an immediate 200 OK response.
 */
async function processWebhookPayload(body: any) {
  try {
    await connectToDB();
    const now = new Date();

    for (const entry of body.entry ?? []) {
      const pageId = entry?.id;

      // 🔑 Get Page Access Token from DB
      const pageRecord = await FacebookPage.findOne({ id: pageId });
      if (!pageRecord) {
        console.warn(`⚠️ No page token stored for page ${pageId}`);
        continue;
      }

      const userId = pageRecord?.userId;
      const user = await User.findOne({ _id: userId });

      if (!user) {
        console.warn(`⚠️ No user found for page ${pageId}`);
        continue;
      }

      // 📜 Subscription & Trial Validation Logic
      const hasValidTrial = 
        user.isFreeTrial?.facebook?.startDate <= now && 
        user.isFreeTrial?.facebook?.endDate >= now;

      const activeSubscription = user.subscriptions?.facebook?.find((sub: any) => 
        sub.page.id == pageId && 
        sub.status === "running" && 
        sub.endDate >= now
      );

      // Skip processing replies if service metrics aren't active
      if (!hasValidTrial && !activeSubscription) {
        console.log(`🚫 Service suspended: No active subscription or trial for user ${user.email} on page ${pageId}`);
        continue; 
      }

      const pageAccessToken = pageRecord.pageAccessToken;

      for (const change of entry.changes ?? []) {
        if (
          change.field === "feed" &&
          change.value?.item === "comment" &&
          change.value?.from?.id !== pageId
        ) {
          const { comment_id, post_id, message, from } = change.value;

          console.log(`🔍 Processing entry for comment ${comment_id} on post ${post_id}`);

          // 🛑 IDEMPOTENCY CHECK: Ensure we haven't already replied to this comment
          const alreadyProcessed = await KeywordUsage.findOne({ commentId: comment_id });
          if (alreadyProcessed) {
            console.log(`⏭️ Comment ${comment_id} already processed in a previous thread. Skipping.`);
            continue;
          }

          // Keyword extraction and regex building
          const words = message?.trim()?.split(/\s+/).map((w: any) => w?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
          const regex = new RegExp(`\\b(${words?.join("|")})\\b`, "i");

          const keywordEntry = await Keyword.findOne({
            "post.id": post_id,
            keyword: { $regex: regex },
          });

          // Default Fallbacks
          let replyComment = "Thanks for reaching out!";
          let replyMessage = "Thank you for your comment!";

          if (keywordEntry?.isActive) {
            // Randomly select dynamic feedback strings if available
            if (keywordEntry?.comments?.length > 0) {
              const randomCommentIdx = Math.floor(Math.random() * keywordEntry.comments.length);
              replyComment = keywordEntry.comments[randomCommentIdx];
            }

            if (keywordEntry?.messages?.length > 0) {
              const randomMessageIdx = Math.floor(Math.random() * keywordEntry.messages.length);
              replyMessage = keywordEntry.messages[randomMessageIdx];
            }
          } else {
            // If the keyword doesn't match or isn't active, skip processing
            continue;
          }

          // 📨 Scheduled Dispatch Process
          if (comment_id) {
            
            // ⏳ Step 1: Delay 15 seconds before commenting back
            console.log(`⏱️ Pausing 15s before posting public comment to: ${comment_id}`);
            await delay(15000); 

            const commentRes = await fetch(
              `https://graph.facebook.com/v23.0/${comment_id}/comments?access_token=${pageAccessToken}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  message: `Hi ${from?.name}, ${replyComment}`,
                }),
              }
            );

            const commentData = await commentRes.json();

            if (commentRes.ok) {
              console.log("💬 Comment reply successfully sent:", commentData.id);
            } else {
              console.error("❌ Failed to send comment reply:", commentData.error?.message);
            }

            // ⏳ Step 2: Delay ANOTHER 15 seconds before delivering the DM
            console.log(`⏱️ Pausing an additional 15s before sending DM to participant.`);
            await delay(15000); 

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

            const messageData = await messageRes.json();

            if (messageRes.ok) {
              console.log("✉️ Private inbox message reply successfully sent.");
            } else {
              console.error("❌ Failed to send private message reply:", messageData.error?.message);
            }

            // Record execution telemetry data if either action succeeds
            if (commentRes.ok || messageRes.ok) {
              keywordEntry.count = (keywordEntry.count || 0) + 1;
              await keywordEntry.save();

              const keywordUsage = await KeywordUsage.create({
                userId: keywordEntry?.userId,
                postId: post_id,
                commentId: comment_id, // 💡 Crucial: Saved to block retries in our Idempotency Check above
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
              console.log(`💾 Document records captured securely for comment ${comment_id}`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("❌ Background Processing Worker Encountered Fatal Error:", error);
  }
}

/**
 * 📡 GET Handler
 * Verification endpoint required by Meta Developer Webhook dashboard configuration.
 */
export async function GET(request: NextRequest) {
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

/**
 * 📥 POST Handler
 * Ingestion entry point for Facebook graph feed mutations.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📬 Webhook event frame arrived.");

    // 🚀 Fire-and-Forget Dispatch: Start processing asynchronously
    processWebhookPayload(body).catch((err) => 
      console.error("❌ Unhandled promise failure on background job thread:", err)
    );

    // Immediately hand back a 200 OK so Meta drops the delivery event trace loop
    return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
  } catch (error) {
    console.error("❌ Webhook primary entry runtime fault:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}