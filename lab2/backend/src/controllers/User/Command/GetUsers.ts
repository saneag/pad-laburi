import { Request, Response } from 'express';

import User from '../../../models/User';

import { ICommand } from '../../../interfaces/IUser/Command/ICommand';
import { UserDestructuring } from '../../../utils/userDestructuring';

export class GetUsers implements ICommand {
    public async execute(req: Request, res: Response): Promise<void> {
        try {
            const users = await User.find().lean();

            if (!users) {
                res.status(404).json({
                    message: 'Users not found',
                });
                return;
            }

            res.status(200).json({
                users: users.map((user) => {
                    const destructuredUser = UserDestructuring(user);

                    return {
                        firstName: destructuredUser.firstName,
                        lastName: destructuredUser.lastName,
                        email: destructuredUser.email,
                        avatarUrl: destructuredUser.avatarUrl,
                        description: destructuredUser.description,
                    };
                }),
            });
        } catch (error) {
            res.status(500).json({
                message: 'Something went wrong',
            });
        }
    }
}
