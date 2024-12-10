import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import schoolRoutes from './routes/schoolRoutes';
import { isConneted } from './config/db';
import path from 'path';

dotenv.config({
    path: path.join(path.resolve() , `.env`)
});


export const app: Application = express();
app.use(bodyParser.json());
app.use(schoolRoutes);

const port: number = Number(process.env.PORT) || 3000;
isConneted();
// Middleware

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('School Management API is running...');
});

// Start the server
export const server = app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
