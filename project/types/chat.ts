export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  status?: 'pending' | 'success' | 'error';
  attachments?: FileAttachment[];
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UITheme {
  id: string;
  name: string;
  background?: string;
  backgroundType?: 'color' | 'image' | 'video' | 'gif';
  chatOpacity?: number;
  fontFamily?: string;
  accentColor?: string;
}