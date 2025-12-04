import { fetch } from 'undici';
import { appConfig } from '../config/app.js';
import type { ChatMessage, GeminiContent } from '../types/arona.js';

const toGeminiContent = (history: ChatMessage[], latestUserMessage: string): GeminiContent[] => {
  const safeHistory = history.slice(-appConfig.arona.maxHistoryItems);
  const serializedHistory = safeHistory.map<GeminiContent>((entry) => ({
    role: entry.role === 'user' ? 'user' : 'model',
    parts: [{ text: entry.text }],
  }));

  return [
    ...serializedHistory,
    {
      role: 'user',
      parts: [{ text: latestUserMessage }],
    },
  ];
};

export class GeminiService {
  static async generateResponse(message: string, history: ChatMessage[] = []): Promise<string> {
    if (!appConfig.gemini.apiKey) {
      throw new Error('Gemini API key is not configured on the server.');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${appConfig.gemini.model}:generateContent?key=${appConfig.gemini.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: toGeminiContent(history, message),
          system_instruction: {
            parts: [{ text: appConfig.arona.systemInstruction }],
          },
          generationConfig: appConfig.gemini.generationConfig,
        }),
      }
    );

    const responseText = await response.text();
    let payload: any;

    try {
      payload = JSON.parse(responseText);
    } catch {
      console.error('[GeminiService] Proxy returned non-JSON response:', responseText.slice(0, 200));
      throw new Error(`Proxy Error (${response.status}): The proxy server returned an invalid response.`);
    }

    if (!response.ok) {
      let apiError = 'Gemini API returned an error';
      
      if (payload?.error) {
        if (typeof payload.error === 'string') {
          apiError = payload.error;
        } else if (payload.error.message) {
          apiError = payload.error.message;
        } else {
          apiError = JSON.stringify(payload.error);
        }
      } else if (payload) {
        apiError = JSON.stringify(payload);
      } else {
        apiError = responseText.slice(0, 500);
      }

      console.error('[GeminiService] API Error:', apiError);
      throw new Error(apiError);
    }

    const text = payload?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? '')
      .join('')
      .trim();

    if (!text) {
      throw new Error('Gemini API returned an empty response');
    }

    return text;
  }
}
