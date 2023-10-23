import { Router } from 'express';
import { DatabaseManager } from './databaseManager';
import mongoose from 'mongoose';
import { PostSchema } from './models/Post';

const routes = Router();

const databaseManager = DatabaseManager.getInstance();

routes.post('/add-database', (req, res) => {
    const message = databaseManager.addDatabase(req.body.databaseUri);
    return res.json({ message: message });
});

routes.post('/sync', async (req, res) => {
    const { databaseUri, data } = req.body;

    if (databaseManager.databasesUri.length === 1) {
        return res.json({ message: 'No databases to sync' });
    }

    try {
        for (let i = 0; i < databaseManager.databasesUri.length; i++) {
            if (databaseManager.databasesUri[i] !== databaseUri) {
                const [connection] = await Promise.all([
                    mongoose.createConnection(databaseManager.databasesUri[i]),
                ]);

                try {
                    const Post = connection.model('Post', PostSchema);

                    await Post.create(data);
                    await connection.close();
                } catch (error) {
                    console.log(error);
                    return res.json({ message: 'Error' });
                }
            }
        }

        return res.json({ message: 'Hello World' });
    } catch (err) {
        console.log(err);
        return res.json({ message: 'Error occurred during synchronization' });
    }
});

routes.delete('/sync', async (req, res) => {
    const { databaseUri, postId } = req.query;

    if (databaseManager.databasesUri.length === 1) {
        return res.json({ message: 'No databases to sync' });
    }

    let errorOccurred = false;
    let postFound = false;

    try {
        for (let i = 0; i < databaseManager.databasesUri.length; i++) {
            if (databaseManager.databasesUri[i] !== databaseUri) {
                const [connection] = await Promise.all([
                    mongoose.createConnection(databaseManager.databasesUri[i]),
                ]);

                try {
                    const Post = connection.model('Post', PostSchema);

                    const post = await Post.findById(postId).lean();

                    if (post) {
                        postFound = true;
                        await Post.findByIdAndDelete(postId);
                    }
                    await connection.close();
                } catch (error) {
                    console.log(error);
                    errorOccurred = true;
                }
            }
        }

        if (!postFound) {
            return res.json({ message: 'Post not found' });
        } else if (errorOccurred) {
            return res.json({ message: 'Error occurred during deletion' });
        } else {
            return res.json({ message: 'Deletion completed' });
        }
    } catch (err) {
        console.log(err);
        return res.json({ message: 'Error occurred during deletion process' });
    }
});

routes.patch('/sync/:postId', async (req, res) => {
    const { postId } = req.params;
    const { databaseUri, data } = req.body;

    if (databaseManager.databasesUri.length === 1) {
        return res.json({ message: 'No databases to sync' });
    }

    let errorOccurred = false;
    let postFound = false;

    try {
        for (let i = 0; i < databaseManager.databasesUri.length; i++) {
            if (databaseManager.databasesUri[i] !== databaseUri) {
                const [connection] = await Promise.all([
                    mongoose.createConnection(databaseManager.databasesUri[i]),
                ]);

                try {
                    const Post = connection.model('Post', PostSchema);

                    const post = await Post.findById(postId).lean();

                    if (post) {
                        postFound = true;
                        await Post.findByIdAndUpdate(postId, data);
                    }
                    await connection.close();
                } catch (error) {
                    console.log(error);
                    errorOccurred = true;
                }
            }
        }

        if (!postFound) {
            return res.json({ message: 'Post not found' });
        } else if (errorOccurred) {
            return res.json({ message: 'Error occurred during update' });
        } else {
            return res.json({ message: 'Update completed' });
        }
    } catch (err) {
        console.log(err);
        return res.json({ message: 'Error occurred during update process' });
    }
});

export default routes;
