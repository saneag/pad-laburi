import axios from 'axios';
import Database from '../db';
import { Request, Response } from 'express';
import { IBasicPost, IPostUpdate } from '../interfaces/IPost/IPost';

class DatabaseSyncController {
    private static _instance: DatabaseSyncController;
    private _databasesUri: string[] = [];
    private _syncApiUrl: string = 'http://localhost:9998/sync';

    private constructor() {
        this.setDatabasesUri();
    }

    public static getInstance(): DatabaseSyncController {
        if (!DatabaseSyncController._instance) {
            DatabaseSyncController._instance = new DatabaseSyncController();
        }

        return DatabaseSyncController._instance;
    }

    public setDatabasesUri(): void {
        this._databasesUri = Database.getURIS();
    }

    public async syncCreate(
        req: Request,
        res: Response,
        post: IBasicPost
    ): Promise<void> {
        try {
            for (let i = 0; i < this._databasesUri.length; i++) {
                await axios.post(
                    this._syncApiUrl,
                    {
                        databaseUri: this._databasesUri[i],
                        data: post,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${req.headers.authorization}`,
                        },
                    }
                );
            }
        } catch (error) {
            console.log(error);
            return;
        }
    }

    public async syncDelete(
        req: Request,
        res: Response,
        postId: string
    ): Promise<void> {
        for (let i = 0; i < this._databasesUri.length; i++) {
            try {
                await axios.delete(
                    `${this._syncApiUrl}?databaseUri=${this._databasesUri[i]}&postId=${postId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${req.headers.authorization}`,
                        },
                    }
                );
            } catch (error) {
                console.log(error);
                return;
            }
        }
    }

    public async syncUpdatePost(
        req: Request,
        res: Response,
        postId: string,
        post: IPostUpdate
    ): Promise<void> {
        for (let i = 0; i < this._databasesUri.length; i++) {
            try {
                await axios.patch(
                    `${this._syncApiUrl}/${postId}`,
                    {
                        databaseUri: this._databasesUri[i],
                        data: post,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${req.headers.authorization}`,
                        },
                    }
                );
            } catch (error) {
                console.log(error);
                return;
            }
        }
    }
}

export default DatabaseSyncController.getInstance();
