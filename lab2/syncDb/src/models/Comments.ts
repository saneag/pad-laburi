import mongoose from 'mongoose';
import { IComment } from '../interfaces/IPost/IComment';

const CommentsSchema = new mongoose.Schema<IComment>({
    content: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 300,
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    postId: {
        type: String,
        required: true,
    },
});

export default mongoose.model('Comments', CommentsSchema);
