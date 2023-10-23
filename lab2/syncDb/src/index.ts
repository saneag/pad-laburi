import express from 'express';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes);

app.listen(9998, () => {
    console.log('Server running on port 9998');
});
