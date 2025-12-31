import mongoose, { Schema, model, Document } from 'mongoose';

interface IFacebook extends Document {
    userEmail: string;
    name: string;
    email: string;
    image: string;
    expires: Date;
    accessToken: string;
}

const FacebookSchema = new Schema<IFacebook>({
    userEmail: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    expires: { type: Date, required: true },
    accessToken: { type: String, required: true }
}, {
    timestamps: true
});

export const Facebook = mongoose.models.Facebook || mongoose.model<IFacebook>('Facebook', FacebookSchema);
