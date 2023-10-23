import { Request, Response } from 'express';

import { IPostController } from '../../interfaces/IPost/IPostController';
import { ICommand } from '../../interfaces/IPost/Command/ICommand';
import { postCommands } from './Command';
import { ReactStrategyContext } from './Strategy/ReactStrategyContext';

class PostController implements IPostController {
    private static _instance: PostController;

    private createPostCommand: ICommand;
    private createPostWithImageCommand: ICommand;
    private updatePostCommand: ICommand;
    private deletePostCommand: ICommand;
    private getPostsCommand: ICommand;
    private getPostCommand: ICommand;
    private reactStrategyContext: ReactStrategyContext;

    private constructor() {
        this.createPostCommand = new postCommands.create();
        this.createPostWithImageCommand = new postCommands.createWithImage();
        this.updatePostCommand = new postCommands.update();
        this.deletePostCommand = new postCommands.delete();
        this.getPostsCommand = new postCommands.getPosts();
        this.getPostCommand = new postCommands.getPost();
        this.reactStrategyContext = new ReactStrategyContext();
    }

    static getInstance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new PostController();
        return this._instance;
    }

    public async createPost(req: Request, res: Response): Promise<void> {
        await this.createPostCommand.execute(req, res);
    }

    public async createPostWithImage(
        req: Request,
        res: Response
    ): Promise<void> {
        await this.createPostWithImageCommand.execute(req, res);
    }

    public async deletePost(req: Request, res: Response): Promise<void> {
        await this.deletePostCommand.execute(req, res);
    }

    public async updatePost(req: Request, res: Response): Promise<void> {
        await this.updatePostCommand.execute(req, res);
    }

    public async getPosts(req: Request, res: Response): Promise<void> {
        await this.getPostsCommand.execute(req, res);
    }

    public async getPost(req: Request, res: Response): Promise<void> {
        await this.getPostCommand.execute(req, res);
    }

    public async reactToPost(req: Request, res: Response): Promise<void> {
        await this.reactStrategyContext.performAction(req, res);
    }
}

export default PostController.getInstance();
