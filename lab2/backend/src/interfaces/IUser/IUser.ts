import mongoose from 'mongoose';

export interface IUser extends ISimpleUser, mongoose.Document {
    _id: string;
    passwordHash: string;
    description: string;
    role: 'user' | 'moderator' | 'admin';
    createdAt: Date;
    updatedAt: Date;
    followers: string[];
    following: string[];
    followRequests: string[];
    followingRequests: string[];
}

export interface IUserUpdate {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    description: string;
    role?: 'user' | 'moderator' | 'admin';
    updatedAt?: Date;
}

export interface IUserRegister extends ISimpleUser {
    passwordHash: string;
}

export interface ISimpleUser {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
}
