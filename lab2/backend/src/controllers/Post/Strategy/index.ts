import { LikeStrategy } from './LikeStrategy';
import { DislikeStrategy } from './DislikeStrategy';
import { CommentStrategy } from './CommentStrategy';

export const strategies = {
    like: LikeStrategy,
    dislike: DislikeStrategy,
    comment: CommentStrategy,
};
