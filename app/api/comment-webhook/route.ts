import Token from '@/components/Token';
import { Keyword } from '@/models/Keyword';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  // Facebook webhook verification
  const url = new URL(request.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  const VERIFY_TOKEN = "1234"

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ WEBHOOK VERIFIED');
    return new NextResponse(challenge, { status: 200 });
  } else {
    console.warn('❌ Verification failed');
    return new NextResponse('Forbidden', { status: 403 });
  }
}

export async function POST(request: NextRequest) {

  const fbAccessTokenRes = await fetch('https://comment-app-sigma.vercel.app/api/auth/facebook/token', {
    cache: 'no-cache'
  });
  const fbAccessTokenData = await fbAccessTokenRes.json();
  const fbAccessToken = fbAccessTokenData?.fb_access_token;

  try {
    const body = await request.json();

    console.log('📬 Webhook event:', JSON.stringify(body, null, 2));

    const entries = body.entry as Array<{
      id: string;
      time: number;
      changes: Array<{
        field: string;
        value: {
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
        if (change.field === 'feed' && change.value.item === 'comment') {
          const { message, comment_id, post_id, sender_id } = change.value;
          console.log(`💬 New comment from ${sender_id}: ${message} (ID: ${comment_id})`);



          console.log('Fetched Facebook Access Token from API:', fbAccessToken);


          const keywordEntry = await Keyword.findOne({ postId: post_id});

          console.log(keywordEntry, "keywordEntry")

          let replyMessage = 'Thank you for your comment!';

          if (keywordEntry) {
            replyMessage = keywordEntry.message;
            console.log(`➡️ Found matching keyword. Replying with: ${replyMessage}`);
          } else {
            console.log('➡️ No matching keyword found. Using default reply.');
          }

          const messageToSend = replyMessage; 


          // page access Token
          const pageAccessTokenRes = await fetch(`https://graph.facebook.com/v23.0/me/accounts?access_token=${fbAccessToken}`)
          const pageAccessTokenData = await pageAccessTokenRes.json();
          // const token = pageAccessTokenData?.data.includes()

          entries[0].id
          

          // Keyword.

          if (fbAccessToken) {

            const messageResponse = await fetch(`https://graph.facebook.com/v23.0/me/messages?access_token=${fbAccessToken}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                "message": {"text": message},
                "recipient": {"comment_id": comment_id}
              }),
            })

            const messageData = await messageResponse.json()
            console.  log('➡️ Reply sent:', messageData);
          }


        }
      }
    }

    return NextResponse.json({ status: 'EVENT_RECEIVED' });
  } catch (error) {
    console.error('❌ Error handling webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
