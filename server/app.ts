import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Import your user routes
import userRoutes from './routes/users';

// Create Express app
const app = express();

// Middleware
app.use(express.json()); // parse JSON bodies
app.use(cors());         // optional: allow cross-origin requests

// Log requests (optional)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/users', userRoutes);

// Optional: serve static files
app.use(express.static(path.join(__dirname, 'public')));

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT: number = parseInt(process.env.PORT || '3001', 10);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
