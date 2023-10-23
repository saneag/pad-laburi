import mongoose, { connection, Schema } from 'mongoose';
import dotenv from 'dotenv';
import * as process from 'process';
import * as console from 'console';

dotenv.config();

class Database {
    private static _instance: Database;
    private readonly connection: any;
    private readonly URIS: string[] = [
        process.env.MONGOURI as string,
        process.env.LOCALDB as string,
    ];

    private constructor() {
        // mongoose.connect(process.env.MONGOURI as string).then(() => {});
        if (process.argv[4] === undefined) {
            console.log('No database selected, defaulting to 0');
        }

        mongoose
            .connect(this.URIS[Number(process.argv[4]) || 0])
            .then(() => {});

        this.connection = mongoose.connection;
        this.connection.on('error', (err: any) => {
            console.error('connection error:', err);
        });
        this.connection.once('open', () => {
            console.log('Connected to Database');
        });
    }

    public static getInstance(): Database {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new Database();
        return this._instance;
    }

    public getConnection(): mongoose.Connection {
        return this.connection;
    }

    public getURIS(): string[] {
        const connectionIndex = this.URIS.indexOf(this.connection.client.s.url);
        return this.URIS.splice(connectionIndex, 1);
    }
}

export default Database.getInstance();
