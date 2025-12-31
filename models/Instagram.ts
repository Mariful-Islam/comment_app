import mongoose, { Schema, model, Document } from 'mongoose';

interface IInstagram extends Document {
    userEmail: string;
    name: string;
    email: string;
    image: string;
    expires: Date;
    accessToken: string;
}

const InstagramSchema = new Schema<IInstagram>({
    userEmail: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    expires: { type: Date, required: true },
    accessToken: { type: String, required: true }
}, {
    timestamps: true
});

export const Instagram = mongoose.models.Instagram || mongoose.model<IInstagram>('Instagram', InstagramSchema);
