import express from 'express';

import path from 'path';
import fs from 'fs';

import multerInstance from '../shared/multerInstance';

import PostController from '../controllers/Post/PostController';

import { checkAuth } from '../middlewares';

const postRoutes = express.Router();
const upload = multerInstance.init('postImage').getMulterUpload();

postRoutes.get(
    '/get-posts',
    checkAuth,
    PostController.getPosts.bind(PostController)
);

postRoutes.get(
    '/get-post/:postId',
    checkAuth,
    PostController.getPost.bind(PostController)
);

postRoutes.post(
    '/create-post',
    checkAuth,
    PostController.createPost.bind(PostController)
);
postRoutes.post(
    '/create-post-with-image',
    checkAuth,
    PostController.createPostWithImage.bind(PostController)
);

postRoutes.post(
    '/post/postImage',
    checkAuth,
    upload.single('postImage'),
    (req: any, res) => {
        res.json({
            url: `uploads/postImage/${req.file.filename}`,
        });
    }
);

postRoutes.patch(
    '/react-to-post/:postId/:reactionType',
    checkAuth,
    PostController.reactToPost.bind(PostController)
);

postRoutes.patch(
    '/update-post/:postId',
    checkAuth,
    PostController.updatePost.bind(PostController)
);

postRoutes.delete(
    '/delete-post/:postId',
    checkAuth,
    PostController.deletePost.bind(PostController)
);
postRoutes.delete('/post/postImage/:fileName', checkAuth, (req: any, res) => {
    const filePath = path.join(__dirname, `uploads/${req.params.fileName}`);

    fs.unlink(filePath, (err) => {
        if (err) {
            res.status(500).json({
                message: 'File could not be deleted.',
            });
            return;
        }

        res.json({
            message: 'File deleted',
        });
    });
});

export default postRoutes;
