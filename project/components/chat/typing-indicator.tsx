'use client';

import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-4xl mr-auto">
      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md text-cyan-400 border border-cyan-500/30 shrink-0">
        <Bot className="w-4 h-4" />
      </div>
      
      <div className="bg-black/40 backdrop-blur-md text-cyan-100 rounded-2xl rounded-bl-md px-4 py-3 border border-cyan-500/20">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}