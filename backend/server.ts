import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import type { IncomingMessage, ServerResponse } from 'node:http';
import chatHandler from './api/chat.ts';

const app = express();
const port = Number(process.env.PORT || 8787);
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:3000,https://maazcrafts.github.io')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'finora-backend' });
});

// Do not add express.json() before this route: the chat handler reads the request stream.
app.all('/api/chat', (req, res) => {
  void chatHandler(req as unknown as IncomingMessage, res as unknown as ServerResponse);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Finora API listening on port ${port}`);
});
