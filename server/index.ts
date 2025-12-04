import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { appConfig } from './config/app.js';
import { aronaRouter } from './routes/arona.js';
import { configureProxy } from './utils/proxy.js';

// Configure Proxy for Gemini API if HTTP_PROXY is set
configureProxy();

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/arona', aronaRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server] Unhandled error', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(appConfig.server.port, () => {
  console.log(`[Server] listening on http://localhost:${appConfig.server.port}`);
});
