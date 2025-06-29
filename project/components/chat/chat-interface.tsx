'use client';

import { useRef, useEffect, useState } from 'react';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { Message, FileAttachment } from '@/types/chat';
import { useChatSessions } from '@/hooks/use-chat-sessions';
import { toast } from 'sonner';

export function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const {
    currentSessionId,
    getCurrentSession,
    addMessageToSession,
    createNewSession,
  } = useChatSessions();

  const currentSession = getCurrentSession();
  const messages = currentSession?.messages || [];

  // Check if API key is configured
  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = localStorage.getItem('openai-api-key');
      const hasKey = !!apiKey;
      setHasApiKey(hasKey);
      console.log(`[ChatInterface] API Key Check: hasApiKey = ${hasKey}`);
    };

    // Check initially
    checkApiKey();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'openai-api-key') {
        console.log('[ChatInterface] Storage event detected for openai-api-key');
        checkApiKey();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when API key is saved
    const handleApiKeySaved = () => {
      console.log('[ChatInterface] Custom event "api-key-saved" received.');
      checkApiKey();
    };

    window.addEventListener('api-key-saved', handleApiKeySaved);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('api-key-saved', handleApiKeySaved);
    };
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string, attachments?: FileAttachment[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) {
      return;
    }

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
    setIsLoading(true);

    try {
      // Get API key from localStorage
      const apiKey = localStorage.getItem('openai-api-key');
      
      if (!apiKey) {
        throw new Error('No OpenAI API key configured. Please go to Settings > API Configuration and add your OpenAI API key.');
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-openai-key': apiKey,
        },
        body: JSON.stringify({ 
          message: content, 
          history: messages,
          attachments: attachments?.map(a => ({ name: a.name, type: a.type }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      
      // Show specific guidance for API key issues
      if (errorMessage.includes('API key')) {
        toast.error('Please configure your OpenAI API key in Settings > API Configuration');
      } else {
        toast.error(errorMessage);
      }
      
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: `Error: ${errorMessage}`,
        timestamp: new Date(),
        status: 'error',
      };

      addMessageToSession(sessionId, errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/20 backdrop-blur-xl">
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} hasApiKey={hasApiKey} />
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-cyan-500/20 bg-black/40 backdrop-blur-xl p-4 safe-area-pb">
        <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
