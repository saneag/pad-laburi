import { Request, Response } from 'express';

export interface ICommand {
    execute(req: Request, res: Response): Promise<void>;
}
