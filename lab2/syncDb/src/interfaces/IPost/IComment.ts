import mongoose from 'mongoose';
import { ISimpleUser } from '../IUser/IUser';

export interface IComment extends mongoose.Document {
    postId: string;
    userId: string;
    content: string;
    creator: ISimpleUser;
    createdAt: Date;
    updatedAt: Date;
}
