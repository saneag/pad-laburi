import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import { IUserController } from '../../interfaces/IUser/IUserController';
import { ICommand } from '../../interfaces/IUser/Command/ICommand';

import { userCommands } from './Command';

export class UserController implements IUserController {
    private static _instance: UserController;

    private loginCommand: ICommand;
    private refreshAccessTokenCommand: ICommand;
    private registerCommand: ICommand;
    private logoutCommand: ICommand;
    private getUserCommand: ICommand;
    private getUserByEmailCommand: ICommand;
    private getUsersCommand: ICommand;
    private updateUserCommand: ICommand;

    private constructor() {
        this.loginCommand = new userCommands.login();
        this.refreshAccessTokenCommand = new userCommands.refreshAccessToken();
        this.registerCommand = new userCommands.register();
        this.logoutCommand = new userCommands.logout();
        this.getUserCommand = new userCommands.getUser();
        this.getUserByEmailCommand = new userCommands.getUserByEmail();
        this.getUsersCommand = new userCommands.getUsers();
        this.updateUserCommand = new userCommands.updateUser();
    }

    static getInstance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new UserController();
        return this._instance;
    }

    public async login(req: Request, res: Response): Promise<void> {
        await this.loginCommand.execute(req, res);
    }

    public async refreshAccessToken(
        req: Request,
        res: Response
    ): Promise<void> {
        await this.refreshAccessTokenCommand.execute(req, res);
    }

    public async register(req: Request, res: Response): Promise<void> {
        await this.registerCommand.execute(req, res);
    }

    public async logout(req: Request, res: Response): Promise<void> {
        await this.logoutCommand.execute(req, res);
    }

    public async getUser(req: Request, res: Response): Promise<void> {
        await this.getUserCommand.execute(req, res);
    }

    public async getUserByEmail(req: Request, res: Response): Promise<void> {
        await this.getUserByEmailCommand.execute(req, res);
    }

    public async updateUser(req: Request, res: Response): Promise<void> {
        await this.updateUserCommand.execute(req, res);
    }

    public async getAllUsers(req: Request, res: Response): Promise<void> {
        await this.getUsersCommand.execute(req, res);
    }
}

export default UserController.getInstance();
