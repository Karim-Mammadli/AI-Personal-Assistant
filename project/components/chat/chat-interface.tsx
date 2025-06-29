'use client';

import { useRef, useEffect } from 'react';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { Message, FileAttachment } from '@/types/chat';
import { useChatSessions } from '@/hooks/use-chat-sessions';
import { toast } from 'sonner';

export function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    currentSessionId,
    getCurrentSession,
    addMessageToSession,
    createNewSession,
  } = useChatSessions();

  const currentSession = getCurrentSession();
  const messages = currentSession?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string, attachments?: FileAttachment[]) => {
    let sessionId = currentSessionId;
    
    // Create new session if none exists
    if (!sessionId) {
      sessionId = createNewSession();
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      attachments,
    };

    addMessageToSession(sessionId, userMessage);

    try {
      // Get API key from localStorage
      const apiKey = localStorage.getItem('openai-api-key');
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-openai-key': apiKey || '',
        },
        body: JSON.stringify({ 
          message: content, 
          history: messages,
          attachments: attachments?.map(a => ({ name: a.name, type: a.type }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        status: 'success',
      };

      addMessageToSession(sessionId, assistantMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please check your API key and try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: 'Sorry, I encountered an error. Please check your API configuration and try again.',
        timestamp: new Date(),
        status: 'error',
      };

      addMessageToSession(sessionId, errorMessage);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/20 backdrop-blur-xl">
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} isLoading={false} />
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-cyan-500/20 bg-black/40 backdrop-blur-xl p-4 safe-area-pb">
        <MessageInput onSendMessage={sendMessage} isLoading={false} />
      </div>
    </div>
  );
}