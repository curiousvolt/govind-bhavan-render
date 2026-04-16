import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './db';

import authRoutes from './routes/auth';
import studentRoutes from './routes/students';
import noticeRoutes from './routes/notices';
import complaintRoutes from './routes/complaints';
import rebateRoutes from './routes/rebates';
import guestroomRoutes from './routes/guestrooms';
import eventRoutes from './routes/events';
import messmenuRoutes from './routes/messmenu';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/rebates', rebateRoutes);
app.use('/api/guestrooms', guestroomRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/messmenu', messmenuRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Serve React Frontend in Production (Render.com)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
  });
}

// Start
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
