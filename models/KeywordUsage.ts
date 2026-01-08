import mongoose, { Schema, model, Document } from 'mongoose';


interface IKeywordUsage extends Document {
    userId: string;
    postId: string;
    keywordId: string;
    target: {
        id: string;
        name: string;
    };
    platform: 'facebook' | 'instagram';
    commentReply: string;
    messageReply: string;
}


const KeywordUsageSchema = new Schema<IKeywordUsage>({
    userId: { type: String, required: true },
    postId: { type: String, required: true },
    keywordId: { type: String, required: true },

    target: {
        id: { type: String, required: true },
        name: { type: String, required: true }
    },

    platform: {
        type: String,
        enum: ['facebook', 'instagram'],
        default: 'facebook'
    },

    commentReply: { type: String, required: true },
    messageReply: { type: String, required: true },

}, {
    timestamps: true
});



export const KeywordUsage = mongoose.models.KeywordUsage || mongoose.model<IKeywordUsage>('KeywordUsage', KeywordUsageSchema);
