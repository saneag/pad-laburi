import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import User from '../../../models/User';

import { ICommand } from '../../../interfaces/IUser/Command/ICommand';

import { comparePasswords } from '../../../utils/PasswordHashFacade';

export class Login implements ICommand {
    public async execute(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email }).lean();

            if (!user) {
                res.status(401).json({
                    message: 'Invalid credentials',
                });
                return;
            }

            const isPasswordValid = await comparePasswords(
                password,
                user.passwordHash
            );

            if (!isPasswordValid) {
                res.status(401).json({
                    message: 'Invalid credentials',
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

            const refreshToken = jwt.sign(
                { userId: user._id },
                process.env.JWTREFRESHSECRET as string,
                {
                    expiresIn: '14d',
                }
            );

            await User.updateOne(
                {
                    _id: user._id,
                },
                {
                    $set: {
                        refreshToken,
                    },
                }
            );

            res.status(200).json({
                message: 'Login successful',
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        } catch (error) {
            console.error(error as Error);
            res.status(500).send('Server error');
        }
    }
}
