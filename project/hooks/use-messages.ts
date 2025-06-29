'use client';

import { useState, useCallback } from 'react';
import { Message } from '@/types/chat';
import { toast } from 'sonner';

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get API key from localStorage
      const apiKey = localStorage.getItem('openai-api-key');
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-openai-key': apiKey || '',
        },
        body: JSON.stringify({ message: content, history: messages }),
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

      setMessages(prev => [...prev, assistantMessage]);
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

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return {
    messages,
    sendMessage,
    isLoading,
  };
}