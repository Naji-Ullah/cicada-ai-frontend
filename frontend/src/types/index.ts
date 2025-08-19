export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface ChatMessage {
  id: string;
  message_type: 'user' | 'ai';
  content: string;
  timestamp: string;
}