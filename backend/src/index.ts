import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { isSupabaseConfigured } from './supabase';

// Routers
import authRoutes from './routes/authRoutes';
import mediaRoutes from './routes/mediaRoutes';
import profileRoutes from './routes/profileRoutes';
import watchlistRoutes from './routes/watchlistRoutes';
import playbackRoutes from './routes/playbackRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[CineWave Backend] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'CineWave Backend Engine',
    database: isSupabaseConfigured() ? 'Supabase PostgreSQL (Cloud)' : 'Local JSON Store (database/store.json)',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/playback', playbackRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Backend Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🎬 CineWave Backend Server running at http://localhost:${PORT}`);
  console.log(`📡 API endpoints ready at http://localhost:${PORT}/api`);
  console.log(`======================================================\n`);
});

export default app;
