import mongoose, { Schema, model, Document } from 'mongoose';

interface IFacebookPage extends Document {
    id: string;
    pageAccessToken: string;
    name: string;
    ownerId: string;
    ownerAccessToken: string;
    ownerName: string;
}

const FacebookPageSchema = new Schema<IFacebookPage>({
    id: { type: String, required: true },
    pageAccessToken: { type: String, required: true },
    name: { type: String, required: true },
    ownerId: { type: String, required: true },
    ownerAccessToken: { type: String, required: true },
    ownerName: { type: String, required: true },
}, {
    timestamps: true
});

export const FacebookPage = mongoose.models.FacebookPage || mongoose.model<IFacebookPage>('FacebookPage', FacebookPageSchema);
