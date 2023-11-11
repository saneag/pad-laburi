import mongoose from 'mongoose';

import { IPostMongo } from '../interfaces/IPost/IPost';
import { IComment } from '../interfaces/IPost/IComment';

const PostSchema = new mongoose.Schema<IPostMongo>({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 1000,
    },
    image: {
        type: String,
        default: '',
    },
    creator: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        avatarUrl: {
            type: String,
            default: '',
        },
    },
    comments: {
        type: [{} as IComment],
        default: [],
    },
    reactions: {
        type: [
            {
                email: {
                    type: String,
                },
                like: {
                    type: Boolean,
                },
                dislike: {
                    type: Boolean,
                },
            },
        ],
        default: [],
    },
    tags: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<IPostMongo>('Post', PostSchema);
