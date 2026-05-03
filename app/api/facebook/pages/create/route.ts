import { FacebookPage } from '@/models/FacebookPage';
import mongoose, { Schema, model, Document } from 'mongoose';
import { cookies } from 'next/headers';




export async function POST(request: Request) {
    const cookieStore = await cookies()
    const userId =  cookieStore.get('userId')?.value;

    if (!userId) {
        return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, pageAccessToken, name, ownerId, ownerAccessToken, ownerName } = body;

        const newPage = new FacebookPage({
            id,
            pageAccessToken,
            name,
            ownerId,
            userId,
            ownerAccessToken,
            ownerName
        });

        await newPage.save();

        return Response.json({ success: true, data: newPage });
    } catch (error:any) {
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}