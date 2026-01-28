import { Keyword } from "@/models/Keyword";
import { KeywordUsage } from "@/models/KeywordUsage";
import { cookies } from "next/headers";
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

    console.log("📬 Instagram Webhook Event:", JSON.stringify(body, null, 2));

    // 1. Check if this is a standard Webhook notification
    const entry = body.entry?.[0];
    if (!entry || !entry.changes) {
      return NextResponse.json({ message: "No changes found" }, { status: 200 });
    }

    // if(new Date(user.isFreeTrial.facebook.endDate) <= new Date()){

    for (const change of entry.changes) {
      // 2. Ensure we are handling a comment field
      console.log("Processing change:", entry.id,);
      if (change.field === "comments" && change?.value?.from?.id !== entry?.id) {
        const { id: commentId, text: message, from } = change.value;
        const recipientId = from.id; // The ID of the person who commented

        console.log("Processing comment ID:", from.username);

        // Skip if the comment is from your own account to avoid infinite loops
        // Replace 'YOUR_INSTAGRAM_USERNAME' with your actual handle
        if (from.username === "YOUR_INSTGRAM_USERNAME") continue;

        const commentText = change.value.text.toLowerCase();
        const postId = change?.value?.media?.id;

        console.log(`New comment on post ${postId}: ${commentText} (Comment ID: ${commentId})`);

        const words = commentText.trim().split(/\s+/).map((w:any) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // escape regex chars
        console.log("Words Array:", words);

        const regex = new RegExp(`\\b(${words.join('|')})\\b`, 'i');

        console.log("Constructed Regex:", regex);

        const matchKeyword = await Keyword.findOne({ "post.id": postId, keyword: { $regex: regex } });

        console.log("Matched Keyword:", matchKeyword);

        // const cookieStore = cookies()
        // const accessToken = (await cookieStore).get('insta_access_token')?.value

        const accessToken = `IGAALoV9MO92xBZAFpzUFVuTWczZA2tZAeTk5MElYOWtjaFk4S1YtQjFUbWJMM1N1T0ZAUY2gwcEV0cUl3MzNwNkhXU2VvcDZAydGw5QVhnVFpKVVdBOUJWMlhkUzlyamJ2RGg0TXlmbl9jZATJPaV9BMmlBTjBVajhqRE9QRFZA4X3hJOAZDZD`;

        console.log("Access Token:", accessToken);

        
        // Note: Graph API v23.0 is a future version; usually, you'll use the current stable (v18.0 - v20.0)

        if(!matchKeyword) {
          return NextResponse.json({ message: "No matching keyword found" }, { status: 200 });
        }

        let replyComment = "Thanks for reaching out!";
        let replyMessage = "Thank you for your comment!";

        if (matchKeyword?.isActive) {
          // Randomly pick from the comments array
          if (matchKeyword?.comments && matchKeyword?.comments?.length > 0) {
            const randomCommentIdx = Math.floor(Math.random() * matchKeyword?.comments?.length);
            replyComment = matchKeyword.comments[randomCommentIdx];
          }

          // Randomly pick from the messages array
          if (matchKeyword?.messages && matchKeyword?.messages?.length > 0) {
            const randomMessageIdx = Math.floor(Math.random() * matchKeyword?.messages?.length);
            replyMessage = matchKeyword?.messages[randomMessageIdx];
          }

          matchKeyword.comments.forEach((cmt:string) => {

            if (cmt === commentText){
              return NextResponse.json({ message: "Comment already replied to with this text" }, { status: 401 });
            }

          });
        }



        if(replyComment && replyMessage && matchKeyword?.isActive) {


          const commentApiUrl = `https://graph.instagram.com/v20.0/${commentId}/replies`;

          await new Promise((r) => setTimeout(r, 15000));

          const commentResponse = await fetch(commentApiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: `Hi @${from?.username}, ${replyComment}` || "",
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

          await new Promise((r) => setTimeout(r, 30000));

          const messageResponse = await fetch(messageApiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              recipient: { comment_id: commentId },
              message: { text: `Hi @${from?.username}, ${replyMessage}` || "" },
              access_token: accessToken,
            }),
          });

          const messageResult = await messageResponse.json();

          if (!messageResponse.ok) {
            console.error("DM Error:", messageResult);
          } else {
            console.log("DM sent successfully ");
          }

          if (commentResponse.ok && messageResponse.ok) {
              matchKeyword.count = (matchKeyword.count || 0) + 1;
              await matchKeyword.save();

              const keywordUsage = await KeywordUsage.create({
                userId: matchKeyword.userId,
                postId: postId,
                keyword: {
                  id: matchKeyword._id,
                  text: matchKeyword.keyword,
                },
                target: {
                  id: from?.id,
                  name: from?.username,
                },
                platform: "instagram",
                commentReply: replyComment,
                messageReply: replyMessage,
              }); 

              await keywordUsage.save();


          }
        }
      } else {
        console.log("Change field is not 'comments' or comment is from own account, skipping.");  
      }
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Webhook Handler Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}