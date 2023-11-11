import { IStrategy } from '../../../interfaces/IPost/Strategy/IStrategy';
import { Request, Response } from 'express';
import User from '../../../models/User';
import Post from '../../../models/Post';

export class CommentStrategy implements IStrategy {
    public async performAction(req: Request, res: Response): Promise<void> {
        try {
            const { content, email } = req.body;
            const { postId } = req.params;

            const user = await User.findOne({ email });

            if (!user) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }

            const post = await Post.findById(postId);

            if (!post) {
                res.status(404).json({ message: 'Post not found.' });
                return;
            }

            const comment = {
                content,
                creator: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    avatarUrl: user.avatarUrl,
                },
                createdAt: new Date(),
                updatedAt: new Date(),
                postId,
            };

            await Post.findByIdAndUpdate(postId, {
                $push: {
                    comments: comment,
                },
            });

            res.status(200).json({ message: 'Comment added successfully.' });
        } catch (error) {
            res.status(500).json({ message: 'Comment addition failed.' });
        }
    }
}
