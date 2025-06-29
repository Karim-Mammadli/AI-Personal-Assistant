'use client';

import { format } from 'date-fns';
import { Bot, User, CheckCircle, XCircle, Clock, File, Image, Download } from 'lucide-react';
import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const getStatusIcon = () => {
    switch (message.status) {
      case 'success':
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'error':
        return <XCircle className="w-3 h-3 text-red-400" />;
      case 'pending':
        return <Clock className="w-3 h-3 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn(
      "flex gap-3 w-full",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-xl shrink-0 mt-1 border",
        isUser 
          ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-black border-cyan-400/50 shadow-lg shadow-cyan-500/25" 
          : isSystem
          ? "bg-gradient-to-br from-orange-500 to-red-500 text-white border-orange-400/50"
          : "bg-black/40 backdrop-blur-md text-cyan-400 border-cyan-500/30"
      )}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      
      <div className={cn(
        "flex flex-col gap-2 max-w-[85%] sm:max-w-[75%]",
        isUser ? "items-end" : "items-start"
      )}>
        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="space-y-2 w-full max-w-sm">
            {message.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-xl border bg-black/20 backdrop-blur-md border-cyan-500/30",
                  isUser ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className="text-cyan-400">
                  {getFileIcon(attachment.type)}
                </div>
                <div className={cn("flex-1 min-w-0", isUser ? "text-right" : "text-left")}>
                  <p className="text-xs sm:text-sm font-medium truncate text-cyan-100">{attachment.name}</p>
                  <p className="text-xs text-cyan-400/60">
                    {formatFileSize(attachment.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = attachment.url;
                    link.download = attachment.name;
                    link.click();
                  }}
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 rounded-lg"
                >
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Message content */}
        {message.content && (
          <div className={cn(
            "rounded-2xl px-4 py-3 break-words backdrop-blur-md border",
            isUser 
              ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-100 rounded-br-md border-cyan-400/30" 
              : "bg-black/40 text-cyan-100 rounded-bl-md border-cyan-500/20"
          )}>
            <p className="whitespace-pre-wrap text-sm sm:text-base">{message.content}</p>
          </div>
        )}
        
        <div className={cn(
          "flex items-center gap-1 text-xs text-cyan-400/60 px-1",
          isUser ? "flex-row-reverse" : "flex-row"
        )}>
          <span>{format(message.timestamp, 'HH:mm')}</span>
          {message.status && getStatusIcon()}
        </div>
      </div>
    </div>
  );
}