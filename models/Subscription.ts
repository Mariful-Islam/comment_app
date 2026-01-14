import mongoose, { Schema, model, Document } from 'mongoose';


interface ISubscription extends Document {
    userId: string;
    postId: string;
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


const SubscriptionSchema = new Schema<ISubscription>({
    userId: { type: String, required: true },
    postId: { type: String, required: true },
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



export const Subscription = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
