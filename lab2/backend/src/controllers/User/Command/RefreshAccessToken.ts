import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import User from '../../../models/User';

import { ICommand } from '../../../interfaces/IUser/Command/ICommand';
import { IDecodedJwt } from '../../../interfaces/IUser/IDecodedJwt';

export class RefreshAccessToken implements ICommand {
    public async execute(req: Request, res: Response): Promise<void> {
        try {
            const { refreshToken } = req.body;
            let isExpired = false;

            jwt.verify(
                refreshToken,
                process.env.JWTREFRESHSECRET as string,
                function (err: any, decoded: any) {
                    if (err) {
                        isExpired = true;
                    } else {
                        const currentTime = Math.floor(Date.now() / 1000); // in seconds
                        isExpired = decoded.exp < currentTime;
                    }
                }
            );

            if (isExpired) {
                res.status(401).json({
                    message: 'Invalid refresh token',
                });
                return;
            }

            const decoded: IDecodedJwt = jwt.verify(
                refreshToken,
                process.env.JWTREFRESHSECRET as string
            ) as IDecodedJwt;

            const user = await User.findOne({
                _id: decoded.userId,
            }).lean();

            if (!user) {
                res.status(401).json({
                    message: 'Invalid refresh token',
                });
                return;
            }

            const accessToken = jwt.sign(
                { userId: user._id },
                process.env.JWTSECRET as string,
                {
                    expiresIn: '1h',
                }
            );

            res.status(200).json({
                message: 'Access token refreshed',
                accessToken: accessToken,
            });
        } catch (error) {
            console.error(error as Error);
            res.status(500).send('Server error');
        }
    }
}
