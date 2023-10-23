import { Request, Response } from 'express';

export interface IUserController {
    login(req: Request, res: Response): Promise<void>;
    register(req: Request, res: Response): Promise<void>;
    refreshAccessToken(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    getUser(req: Request, res: Response): Promise<void>;
    updateUser(req: Request, res: Response): Promise<void>;
}
