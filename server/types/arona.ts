export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface ChatRequestBody {
  message: string;
  history?: ChatMessage[];
}

export interface GeminiContentPart {
  text?: string;
}

export interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiContentPart[];
}
