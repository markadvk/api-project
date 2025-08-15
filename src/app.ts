// src/app.ts
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import tableRoutes from './routes/tableRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/table', tableRoutes);

// Error handler
app.use(errorHandler);

export default app;
