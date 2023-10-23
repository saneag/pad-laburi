import mongoose from 'mongoose';

interface IMongoDatabaseConnection {
    uri: string;
    connection: any;
}

export class DatabaseManager {
    private static _instance: DatabaseManager;
    databasesUri: string[] = [];

    private constructor() {}

    static getInstance(): DatabaseManager {
        if (!DatabaseManager._instance) {
            DatabaseManager._instance = new DatabaseManager();
        }
        return DatabaseManager._instance;
    }

    addDatabase(databaseUri: string): string {
        if (!this.databasesUri.includes(databaseUri)) {
            this.databasesUri.push(databaseUri);
            return 'Database added';
        }

        return 'Database already exists';
    }
}
