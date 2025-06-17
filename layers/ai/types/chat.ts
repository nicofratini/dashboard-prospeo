export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  createdAt: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatStore {
  state: ChatState;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}
