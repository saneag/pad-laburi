import { Request, Response } from 'express';

import Post from '../../../models/Post';

import { ICommand } from '../../../interfaces/IPost/Command/ICommand';

import { PostDecorator } from '../Decorator/PostDecorator';

export class GetPost implements ICommand {
    public async execute(req: Request, res: Response): Promise<void> {
        try {
            const { postId } = req.params;

            const post = await Post.findById(postId).lean();

            if (!post) {
                res.status(404).json({ message: 'Post not found.' });
                return;
            }

            const postDecorator = new PostDecorator();
            const simplifiedText = postDecorator.simplifyText(post.content);
            const numberOfLikes = post.reactions.filter(
                (reaction) => reaction.like === true
            ).length;
            const numberOfDislikes = post.reactions.filter(
                (reaction) => reaction.dislike === true
            ).length;
            const numberOfComments = post.comments.length;

            const simplifiedPost = {
                ...post,
                content: simplifiedText,
                numberOfLikes,
                numberOfDislikes,
                numberOfComments,
            };

            res.status(200).json({ message: 'Success.', post: simplifiedPost });
        } catch (error) {
            res.status(500).json({ message: 'Post could not be loaded.' });
        }
    }
}
