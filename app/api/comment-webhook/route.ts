import Token from "@/components/Token";
import { Facebook } from "@/models/Facebook";
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

    const entries = body.entry as Array<{
      id: string;
      time: number;
      changes: Array<{
        field: string;
        value: {
          from: any;
          item: string;
          verb: string;
          message?: string;
          post_id?: string;
          comment_id?: string;
          sender_id?: string;
        };
      }>;
    }>;

    for (const entry of entries ?? []) {
      for (const change of entry.changes ?? []) {

        const fbAccessToken = `EAALEu4RXGR0BQJk66DdJRJxdwzzRZCBdOlbUHTkLGs8srzUqPZA6fWnWF4ySW4GuTAEH8Hbk5UuZA4OgxfkBIDHpnBJeW6Ai9jACDHlboGzFJ4m2I2Iv5MgABZCCYjywLz8WUkeIGzhMDkPn6Cv0z0hSrpXHSteh2uHqrt28yPekiJek8S5cLq62ZB6GtOSbd7OnNu2gXwwIrn1yOSjZAMzdFZAb3AlFzfJ8cVMms9ZA0bUpa7YZCf58tWzs0N81E15JbHR6jEuDQr0WIRRuY66uCZCrCZA2XPSuGU76f5K`

        const pagesRes = await fetch(`https://graph.facebook.com/v23.0/me/accounts?access_token=${fbAccessToken}`);
        const pagesJson = await pagesRes.json();

        const pagesData = pagesJson?.data || [];

        const targetPageId = entry?.id;

        const page = pagesData.find((p: any): any => p.id === targetPageId);


        if (change.field === "feed" && change.value.item === "comment", change.value.from?.id !== entry?.id ) {
          const { message, comment_id, post_id, sender_id } = change.value;
          console.log(
            `💬 New comment from ${sender_id}: ${message} (ID: ${comment_id})`
          );

          const keywordEntry = await Keyword.findOne({ postId: post_id });

          console.log(keywordEntry, "keywordEntry");

          let replyMessage = "Thank you for your comment!";

          let replyComment = ""

          if (keywordEntry) {
            replyMessage = keywordEntry?.message;
            replyComment = keywordEntry?.comment;

            console.log(
              `➡️ Found matching keyword. Replying with: ${replyMessage}`
            );

            // const cookieStore = cookies();
            // const fbAccessToken = (await cookieStore).get("fb_access_token")?.value;

            // const API_URL = `https://comment-app-ai5w.vercel.app`

            // const fbAccessTokenRes = await fetch(`${API_URL}/api/auth/facebook/token`)
            // const fbAccessTokenData = await fbAccessTokenRes.json()
            // const fbAccessToken = fbAccessTokenData?.fb_access_token


            // const fbAccessToken = request.cookies.get('fb_access_token')

            

            console.log(fbAccessToken, "ppppppppppppp");

            // const pagesRes = await fetch(`https://graph.facebook.com/v23.0/me/accounts?access_token=${fbAccessToken}`);
            // const pagesJson = await pagesRes.json();

            // const pagesData = pagesJson?.data || [];

            // const targetPageId = entry?.id;

            // const page = pagesData.find((p: any): any => p.id === targetPageId);

            if (!page) {
              throw new Error("Page not found or user has no access");
            }

            const pageAccessToken = page?.access_token;


            if (replyMessage && pageAccessToken && comment_id) {
              const messageResponse = await fetch(
                `https://graph.facebook.com/v23.0/me/messages?access_token=${pageAccessToken}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    message: { text: replyMessage },
                    recipient: { comment_id: comment_id },
                  }),
                }
              );

              const messageData = await messageResponse.json();
              console.log("message sent")


              const commentResponse = await fetch(`https://graph.facebook.com/v23.0/${comment_id}/comments?access_token=${pageAccessToken}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    message: replyComment,
                  }),
                }
              );

              const commentData = await commentResponse.json();
              console.log("✅ Reply sent to comment:");
       
            }
          } else {
            console.log("➡️ No matching keyword found. Using default reply.");
          }
        }
      }
    }

    return NextResponse.json({ status: "EVENT_RECEIVED" });
  } catch (error) {
    console.error("❌ Error handling webhook:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
