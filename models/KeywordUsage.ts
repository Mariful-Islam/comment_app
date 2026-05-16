import mongoose, { Schema, model, Document } from 'mongoose';


interface IKeywordUsage extends Document {
    userId: string;
    postId: string;
    commentId: string; // 💡 Crucial: Saved to block retries in our Idempotency Check above
    keyword: {
        id: string;
        text: string;
    };
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
    commentId: { type: String, required: true, unique: true, index: true }, // 💡 Crucial: Saved to block retries in our Idempotency Check above
    keyword: {
        id: { type: String, required: true },
        text: { type: String, required: true }
    },

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
    timestamps: true,
    timeseries: { timeField: 'createdAt' }  
});



export const KeywordUsage = mongoose.models.KeywordUsage || mongoose.model<IKeywordUsage>('KeywordUsage', KeywordUsageSchema);
