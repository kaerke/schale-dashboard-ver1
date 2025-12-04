import { z } from 'zod';

// Define schema for environment variables
const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  GEMINI_API_KEY: z.string().transform(val => val.trim()).optional(),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  GEMINI_TEMPERATURE: z.coerce.number().optional(),
  GEMINI_MAX_TOKENS: z.coerce.number().optional(),
  MAX_HISTORY_ITEMS: z.coerce.number().optional(),
  HTTP_PROXY: z.string().optional(),
});

// Parse and validate
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('? Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

const { 
  PORT, 
  GEMINI_API_KEY, 
  GEMINI_MODEL, 
  GEMINI_TEMPERATURE,
  GEMINI_MAX_TOKENS,
  MAX_HISTORY_ITEMS,
  HTTP_PROXY 
} = parsedEnv.data;

// Debug log to verify key loading (masking most of the key)
if (GEMINI_API_KEY) {
  console.log(`[Config] Loaded Gemini API Key: ${GEMINI_API_KEY.substring(0, 4)}...${GEMINI_API_KEY.substring(GEMINI_API_KEY.length - 4)} (Length: ${GEMINI_API_KEY.length})`);
} else {
  console.warn('[Config] ?? Gemini API Key is MISSING or EMPTY! Chat features will not work.');
}

export const env = {
  port: PORT,
  gemini: {
    apiKey: GEMINI_API_KEY || '',
    model: GEMINI_MODEL,
    temperature: GEMINI_TEMPERATURE, // undefined means use app default
    maxTokens: GEMINI_MAX_TOKENS,    // undefined means use app default
  },
  chat: {
    maxHistoryItems: MAX_HISTORY_ITEMS, // undefined means use app default
  },
  httpProxy: HTTP_PROXY,
} as const;
