import { Request, Response } from 'express';

import { ICommand } from '../../../interfaces/IUser/Command/ICommand';

export class Logout implements ICommand {
    public async execute(req: Request, res: Response): Promise<void> {
        try {
            res.cookie('accessToken', '', {
                httpOnly: true,
                expires: new Date(0),
            });

            res.cookie('refreshToken', '', {
                httpOnly: true,
                expires: new Date(0),
            });

            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.status(200).json({
                message: 'Logout successful',
            });
        } catch (error) {
            res.status(500).json({
                message: 'Internal server error',
            });
        }
    }
}
