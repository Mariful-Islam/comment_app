import mongoose, { Schema, model, Document } from 'mongoose';

interface IKeyword extends Document {
    postId: string;
    keyword: string;
    comment: string;
    message: string;
}

const KeywordSchema = new Schema<IKeyword>({
    postId: { type: String, required: true },
    keyword: { type: String, required: true },
    comment: { type: String, required: true },
    message: { type: String, required: true }
}, {
    timestamps: true
});

export const Keyword = mongoose.models.Keyword || mongoose.model<IKeyword>('Keyword', KeywordSchema);
