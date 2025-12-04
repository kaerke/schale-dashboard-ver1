export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface ChatRequestBody {
  message: string;
  history?: ChatMessage[];
}

export interface ChatResponseBody {
  text: string;
}

export const sendAronaMessage = async (message: string, history: ChatMessage[] = []) => {
  const response = await fetch('/api/arona/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, history } satisfies ChatRequestBody),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    throw new Error(errorPayload.error || 'Arona service is unavailable');
  }

  return response.json() as Promise<ChatResponseBody>;
};

export const checkAronaHealth = async () => {
  const response = await fetch('/api/arona/health');
  if (!response.ok) {
    throw new Error('Arona backend is offline');
  }
  return response.json();
};
