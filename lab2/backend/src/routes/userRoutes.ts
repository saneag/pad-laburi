import express from 'express';
import path from 'path';
import fs from 'fs';

import UserController from '../controllers/User/UserController';

import multerInstance from '../shared/multerInstance';

import {
    checkAuth,
    loginValidation,
    registerValidation,
    validateErrors,
} from '../middlewares';

const userRoutes = express.Router();
const upload = multerInstance.init('userAvatar').getMulterUpload();

userRoutes.get('/user', checkAuth, UserController.getUser.bind(UserController));
userRoutes.get(
    '/user/:email',
    UserController.getUserByEmail.bind(UserController)
);
userRoutes.get('/users', UserController.getAllUsers.bind(UserController));

userRoutes.post(
    '/user/register',
    registerValidation,
    validateErrors,
    UserController.register.bind(UserController)
);
userRoutes.post(
    '/user/login',
    loginValidation,
    validateErrors,
    UserController.login.bind(UserController)
);
userRoutes.post('/user/logout', UserController.logout.bind(UserController));
userRoutes.post(
    '/user/refreshAccessToken',
    UserController.refreshAccessToken.bind(UserController)
);
userRoutes.post(
    '/user/userAvatar',
    checkAuth,
    upload.single('avatar'),
    (req: any, res) => {
        res.json({
            url: `uploads/userAvatar/${req.file.filename}`,
        });
    }
);

userRoutes.patch(
    '/user/updateUser',
    checkAuth,
    UserController.updateUser.bind(UserController)
);

userRoutes.delete('/user/userAvatar/:fileName', checkAuth, (req: any, res) => {
    const filePath = path.join(__dirname, `uploads/${req.params.fileName}`);

    fs.unlink(filePath, (err) => {
        if (err) {
            res.status(500).json({
                message: 'File deletion failed',
            });
            return;
        }

        res.json({
            message: 'File deleted',
        });
    });
});

export default userRoutes;
