'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './message-bubble';
import { TypingIndicator } from './typing-indicator';
import { Message } from '@/types/chat';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  hasApiKey?: boolean;
}

export function MessageList({ messages, isLoading, hasApiKey = true }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center p-8">
        <div className="max-w-md">
          <div className="text-6xl mb-4">⚡</div>
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Welcome to NEXUS AI
          </h2>
          <p className="text-cyan-400/80 mb-4">
            Advanced neural interface ready for deployment. 
            Initialize conversation protocol to begin.
          </p>
          
          {!hasApiKey && (
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mt-4">
              <h3 className="text-yellow-300 font-medium mb-2">⚠️ API Key Required</h3>
              <p className="text-yellow-400/80 text-sm mb-3">
                To start chatting, you need to configure your OpenAI API key.
              </p>
              <p className="text-yellow-400/60 text-xs">
                Click the settings icon (⚙️) in the top-right corner to configure your API key.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <ScrollArea ref={scrollAreaRef} className="h-full">
      <div className="p-4 space-y-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && <TypingIndicator />}
      </div>
    </ScrollArea>
  );
}