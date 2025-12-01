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
          const { message, comment_id, sender_id } = change.value;
          console.log(`💬 New comment from ${sender_id}: ${message} (ID: ${comment_id})`);

          // 👉 You can handle your business logic here:
          // e.g., reply to the comment, store it in a database, etc.
        }
      }
    }

    return NextResponse.json({ status: 'EVENT_RECEIVED' });
  } catch (error) {
    console.error('❌ Error handling webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
