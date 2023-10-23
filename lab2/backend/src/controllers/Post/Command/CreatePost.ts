import { Request, Response } from 'express';
import mongoose from 'mongoose';

import User from '../../../models/User';
import Post from '../../../models/Post';

import { ICommand } from '../../../interfaces/IPost/Command/ICommand';

import { PostDecorator } from '../Decorator/PostDecorator';
import { PostBuilder } from '../Builder/PostBuilder';
import DatabaseSyncController from '../../DatabaseSyncController';

export class CreatePost implements ICommand {
    public async execute(req: Request, res: Response): Promise<void> {
        try {
            const user = await User.findById(req.params.userId).lean();

            if (!user) {
                res.status(401).json({
                    message: 'Invalid credentials',
                });
                return;
            }

            const { title, content } = req.body;

            if (!title || !content) {
                res.status(400).json({
                    message: 'Title and content are required.',
                });
                return;
            }

            const postDecorator = new PostDecorator();
            const formattedText = postDecorator.decorateText(content);

            const postBuilder = new PostBuilder();

            const post = postBuilder
                .setCreator(user)
                .setTitle(title)
                .setContent(formattedText);

            const buildedPost = {
                ...post.buildSimplePost(),
                _id: new mongoose.Types.ObjectId(),
            };

            await Post.create(buildedPost);

            await DatabaseSyncController.syncCreate(req, res, buildedPost);

            res.status(201).json({
                message: 'Post created successfully.',
            });
        } catch (error) {
            res.status(500).json({
                message: 'Post creation failed.',
            });
        }
    }
}
