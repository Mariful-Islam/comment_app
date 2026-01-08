import mongoose, { Schema, model, Document } from 'mongoose';

interface IKeyword extends Document {
    userId: string;
    post: {
        id: string;
        text: string;
    };
    platform: string;
    keyword: string;
    comments: string[];
    messages: string[];
    count: number;
    isActive: boolean;
}

const KeywordSchema = new Schema<IKeyword>({
    userId: { type: String, required: true },
    post: {
        id: { type: String, required: true },
        text: { type: String, required: true }
    },
    platform: { type: String, enum: [ 'facebook', 'instagram'], default: 'facebook' },
    keyword: { type: String, required: true },
    comments: [{ type: String, required: true }],
    messages: [{ type: String, required: true }],
    count: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false}
}, {
    timestamps: true
});

export const Keyword = mongoose.models.Keyword || mongoose.model<IKeyword>('Keyword', KeywordSchema);
