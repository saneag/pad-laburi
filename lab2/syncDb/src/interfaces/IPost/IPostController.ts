import { Request, Response } from 'express';

export interface IPostController {
    createPost(req: Request, res: Response): Promise<void>;
    createPostWithImage(req: Request, res: Response): Promise<void>;
    getPosts(req: Request, res: Response): Promise<void>;
    updatePost(req: Request, res: Response): Promise<void>;
    deletePost(req: Request, res: Response): Promise<void>;
}
