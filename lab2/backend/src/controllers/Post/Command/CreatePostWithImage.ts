import { Request, Response } from 'express';

import User from '../../../models/User';
import Post from '../../../models/Post';

import { ICommand } from '../../../interfaces/IPost/Command/ICommand';

import { PostDecorator } from '../Decorator/PostDecorator';
import { PostBuilder } from '../Builder/PostBuilder';

export class CreatePostWithImage implements ICommand {
    public async execute(req: Request, res: Response): Promise<void> {
        try {
            const user = await User.findById(req.params.userId).lean();

            if (!user) {
                res.status(401).json({
                    message: 'Invalid credentials',
                });
                return;
            }

            const { title, content, image } = req.body;

            if (!title || !content || !image) {
                res.status(400).json({
                    message: 'Title, content and image are required.',
                });
                return;
            }

            const postDecorator = new PostDecorator();
            const formattedText = postDecorator.decorateText(content);

            const postBuilder = new PostBuilder();

            const post = postBuilder
                .setCreator(user)
                .setTitle(title)
                .setContent(formattedText)
                .setImage(image);

            await Post.create({
                ...post.buildPostWithImages(),
            });

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
