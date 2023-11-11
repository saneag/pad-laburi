import mongoose from 'mongoose';

import { ISimpleUser } from '../IUser/IUser';
import { IComment } from './IComment';

export interface IPostMongo extends IPost, mongoose.Document {
    _id: string;
}

export interface IPost extends IImagePost {
    creator: ISimpleUser;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    comments: IComment[];
    reactions: IPostReaction[];
    tags: string[];
}

export interface IBasicPost {
    title: string;
    content: string;
    creator: ISimpleUser;
}

export interface IImagePost extends IBasicPost {
    image: string;
}

export interface IPostUpdate {
    title: string;
    content: string;
    image: string;
    updatedAt: Date;
}

export interface IPostReaction {
    email: string;
    like?: boolean;
    dislike?: boolean;
}
