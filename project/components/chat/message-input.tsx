'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Mic, MicOff } from 'lucide-react';
import { FileUpload } from './file-upload';
import { FileAttachment } from '@/types/chat';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (message: string, attachments?: FileAttachment[]) => void;
  isLoading: boolean;
}

export function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || selectedFiles.length > 0) && !isLoading) {
      onSendMessage(message.trim(), selectedFiles);
      // Clear input after sending
      setMessage('');
      setSelectedFiles([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFilesSelected = (files: FileAttachment[]) => {
    setSelectedFiles(files);
  };

  const handleRemoveFile = (fileId: string) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    const fileAttachments: FileAttachment[] = files.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
    }));

    setSelectedFiles(prev => [...prev, ...fileAttachments]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement actual voice recording functionality
  };

  return (
    <div className="space-y-3">
      <FileUpload
        onFilesSelected={handleFilesSelected}
        selectedFiles={selectedFiles}
        onRemoveFile={handleRemoveFile}
      />
      
      <form onSubmit={handleSubmit} className="flex gap-3 items-center">
        {/* File attachment button - vertically centered with input */}
        <div className="flex items-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json"
          />
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-11 w-11 p-0 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/50 text-cyan-400 hover:text-cyan-300 transition-all duration-200 flex items-center justify-center"
            title="Attach files"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Message input container */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your message..."
            className="min-h-[44px] max-h-32 resize-none bg-black/20 backdrop-blur-md border-2 border-cyan-500/30 focus:border-cyan-400/60 rounded-xl text-cyan-100 placeholder:text-cyan-400/60 pr-12 flex items-center"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              paddingTop: '12px',
              paddingBottom: '12px'
            }}
            disabled={isLoading}
          />
          
          {/* Voice recording button inside textarea - vertically centered */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleRecording}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-lg transition-all duration-200 flex items-center justify-center",
              isRecording 
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40" 
                : "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30"
            )}
            title={isRecording ? "Stop recording" : "Start voice recording"}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
        </div>
        
        {/* Send button - vertically centered */}
        <div className="flex items-center">
          <Button 
            type="submit" 
            disabled={(!message.trim() && selectedFiles.length === 0) || isLoading}
            className="h-11 w-11 p-0 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold transition-all duration-200 shadow-lg shadow-cyan-500/25 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}