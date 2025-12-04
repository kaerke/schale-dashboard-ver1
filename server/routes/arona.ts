import { Router } from 'express';
import { z } from 'zod';

import { appConfig } from '../config/app.js';
import { GeminiService } from '../services/geminiService.js';
import type { ChatMessage } from '../types/arona.js';

const router = Router();

const chatSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    text: z.string().min(1),
  })).optional(),
});

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', model: appConfig.gemini.model });
});

router.post('/chat', async (req, res) => {
  const parsed = chatSchema.safeParse(req.body);

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || 'Invalid payload';
    return res.status(400).json({ error: message });
  }

  const { message, history = [] } = parsed.data;

  try {
    const text = await GeminiService.generateResponse(message, history as ChatMessage[]);
    return res.json({ text });
  } catch (error) {
    console.error('[Arona] chat endpoint failed', error);
    
    // Determine status code based on error message or type if possible
    // For now, we default to 500, but if it's a configuration error (missing key), it might be 503
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    const statusCode = errorMessage.includes('API key is not configured') ? 503 : 500;

    return res.status(statusCode).json({
      error: errorMessage,
    });
  }
});

export const aronaRouter = router;
