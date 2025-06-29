'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './message-bubble';
import { TypingIndicator } from './typing-indicator';
import { Message } from '@/types/chat';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center p-8">
        <div className="max-w-md">
          <div className="text-6xl mb-4">⚡</div>
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Welcome to NEXUS AI
          </h2>
          <p className="text-cyan-400/80">
            Advanced neural interface ready for deployment. 
            Initialize conversation protocol to begin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && <TypingIndicator />}
      </div>
    </ScrollArea>
  );
}