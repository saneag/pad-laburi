import express from 'express';
import * as path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

import Database from './db';

import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import Post from './models/Post';

const app = express();
dotenv.config();

const connection: any = Database.getConnection();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/hf', userRoutes, postRoutes);

app.delete('/api/hf/delete', async (req, res) => {
    const posts = await Post.find({
        title: 'Hello',
    });

    if (posts.length)
        for (let i = 0; i < posts.length; i++) {
            await Post.findByIdAndDelete(posts[i].id);
        }

    return res.json({
        message: 'Succes',
    });
});

// const PORT = process.env.PORT;

const PORT = process.argv[3] || process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    axios.post('http://localhost:9998/add-database', {
        databaseUri: connection.client.s.url,
    });
}).on('error', (err) => {
    console.log(`Error starting server: ${err.message}`);
});
