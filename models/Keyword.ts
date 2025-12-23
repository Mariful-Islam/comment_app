import mongoose, { Schema, model, Document } from 'mongoose';

interface IKeyword extends Document {
    userId: string;
    postId: string;
    postMessage: string;
    keyword: string;
    comment: string;
    message: string;
    isActive: boolean;
}

const KeywordSchema = new Schema<IKeyword>({
    userId: { type: String, required: true },
    postId: { type: String, required: true },
    postMessage: { type: String, required: true },
    keyword: { type: String, required: true },
    comment: { type: String, required: true },
    message: { type: String, required: true },
    isActive: { type: Boolean, default: false}
}, {
    timestamps: true
});

export const Keyword = mongoose.models.Keyword || mongoose.model<IKeyword>('Keyword', KeywordSchema);
