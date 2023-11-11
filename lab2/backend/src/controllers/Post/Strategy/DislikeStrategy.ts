import { IStrategy } from '../../../interfaces/IPost/Strategy/IStrategy';
import { Request, Response } from 'express';
import Post from '../../../models/Post';

export class DislikeStrategy implements IStrategy {
    public async performAction(req: Request, res: Response): Promise<void> {
        try {
            const { postId } = req.params;
            const { email } = req.body;

            const post = await Post.findById(postId);

            if (!post) {
                res.status(404).json({ message: 'Post not found.' });
                return;
            }

            const isLiked = post.reactions.some(
                (reaction) => reaction.email === email && reaction.like === true
            );

            const isDislike = post.reactions.some(
                (reaction) =>
                    reaction.email === email && reaction.dislike === true
            );

            if (isDislike) {
                await Post.findByIdAndUpdate(postId, {
                    $pull: {
                        reactions: {
                            email,
                            dislike: true,
                        },
                    },
                });
            } else {
                await Post.findByIdAndUpdate(postId, {
                    $push: {
                        reactions: {
                            email,
                            dislike: true,
                        },
                    },
                });
            }

            if (isLiked) {
                await Post.findByIdAndUpdate(postId, {
                    $pull: {
                        reactions: {
                            email,
                            like: true,
                        },
                    },
                });
            }

            res.status(200).json({ message: 'Success.' });
        } catch (error) {
            res.status(500).json({ message: 'Dislike failed.' });
        }
    }
}
