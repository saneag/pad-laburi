import { Request, Response } from 'express';

import Post from '../../../models/Post';

import { ICommand } from '../../../interfaces/IPost/Command/ICommand';

import { PostBuilder } from '../Builder/PostBuilder';
import { PostDecorator } from '../Decorator/PostDecorator';
import DatabaseSyncController from '../../DatabaseSyncController';

export class UpdatePost implements ICommand {
    public async execute(req: Request, res: Response): Promise<void> {
        try {
            const { postId } = req.params;
            const { title, content, image } = req.body;

            const post = await Post.findById(postId).lean();

            if (!post) {
                res.status(404).json({
                    message: 'Post not found.',
                });
                return;
            }

            const postDecorator = new PostDecorator();
            const formattedText = postDecorator.decorateText(content);

            const postBuilder = new PostBuilder();

            postBuilder
                .setTitle(title)
                .setContent(formattedText)
                .setImage(image)
                .setUpdatedAt(new Date());

            const buildedPost = { ...postBuilder.buildUpdate() };

            await Post.findByIdAndUpdate(postId, buildedPost).lean();

            await DatabaseSyncController.syncUpdatePost(
                req,
                res,
                postId,
                buildedPost
            );

            res.status(200).json({
                message: 'Post updated successfully.',
            });
        } catch (error) {
            res.status(500).json({
                message: 'Post update failed.',
            });
        }
    }
}
