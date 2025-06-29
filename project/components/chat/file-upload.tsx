'use client';

import { Button } from '@/components/ui/button';
import { X, File, Image } from 'lucide-react';
import { FileAttachment } from '@/types/chat';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFilesSelected: (files: FileAttachment[]) => void;
  selectedFiles: FileAttachment[];
  onRemoveFile: (fileId: string) => void;
}

export function FileUpload({ selectedFiles, onRemoveFile }: FileUploadProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  if (selectedFiles.length === 0) return null;

  return (
    <div className="space-y-2 max-h-32 overflow-y-auto">
      {selectedFiles.map((file) => (
        <div
          key={file.id}
          className="flex items-center gap-3 p-3 bg-black/20 backdrop-blur-md rounded-xl text-sm border border-cyan-500/30"
        >
          <div className="text-cyan-400">
            {getFileIcon(file.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate font-medium text-xs text-cyan-100">{file.name}</p>
            <p className="text-xs text-cyan-400/60">
              {formatFileSize(file.size)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveFile(file.id)}
            className="h-6 w-6 p-0 hover:bg-red-500/20 hover:text-red-400 text-cyan-400/60 rounded-lg"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}