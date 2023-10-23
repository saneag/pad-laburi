import { CreatePost } from './CreatePost';
import { UpdatePost } from './UpdatePost';
import { DeletePost } from './DeletePost';
import { CreatePostWithImage } from './CreatePostWithImage';
import { GetPosts } from './GetPosts';
import { GetPost } from './GetPost';

export const postCommands = {
    create: CreatePost,
    update: UpdatePost,
    delete: DeletePost,
    createWithImage: CreatePostWithImage,
    getPosts: GetPosts,
    getPost: GetPost,
};
