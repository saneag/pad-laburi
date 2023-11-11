import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

import { IDecodedJwt } from '../../interfaces/IUser/IDecodedJwt';

export default (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        try {
            const decoded: IDecodedJwt = jwt.verify(
                token,
                process.env.JWTSECRET as string
            ) as IDecodedJwt;
            req.params.userId = decoded.userId;
            next();
        } catch (err) {
            return res.status(403).json({
                message: 'Access denied',
            });
        }
    } else {
        return res.status(403).json({
            message: 'Access denied',
        });
    }
};
