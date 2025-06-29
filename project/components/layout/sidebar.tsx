'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, MessageSquare, Trash2, Menu, X, ChevronLeft, ChevronRight, History } from 'lucide-react';
import { ChatSession } from '@/types/chat';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
}

export function Sidebar({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewSession,
  onDeleteSession,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const handleSessionSelect = (sessionId: string) => {
    onSessionSelect(sessionId);
    setIsOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-black/20 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-400/50 text-cyan-400 hover:text-cyan-300 rounded-lg"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Made smaller when expanded (w-48 instead of w-64) */}
      <div className={cn(
        "fixed md:relative inset-y-0 left-0 z-40",
        "bg-black/40 backdrop-blur-xl border-r border-cyan-500/20",
        "transform transition-all duration-300 ease-in-out",
        "md:transform-none md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        // Width made smaller when expanded: w-48 instead of w-64
        isExpanded ? "w-80 md:w-48" : "w-80 md:w-12"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-cyan-500/20">
            {isExpanded ? (
              <>
                <Button
                  onClick={onNewSession}
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-medium rounded-lg px-3 py-1.5 text-xs transition-all duration-200 shadow-lg shadow-cyan-500/25"
                >
                  <Plus className="w-3 h-3" />
                  New Chat
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleExpanded}
                  className="hidden md:flex h-6 w-6 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg"
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
              </>
            ) : (
              <div className="hidden md:flex w-full justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleExpanded}
                  className="h-6 w-6 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
          
          {/* Collapsed state - show only icons */}
          {!isExpanded && (
            <div className="hidden md:flex flex-col items-center p-1 space-y-1">
              <Button
                variant="ghost"
                onClick={onNewSession}
                className="h-8 w-8 p-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-400/30 hover:to-blue-400/30 text-cyan-400 hover:text-cyan-300 rounded-lg border border-cyan-500/30"
                title="New Chat"
              >
                <Plus className="w-3 h-3" />
              </Button>
              
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg border border-cyan-500/30"
                title="History"
              >
                <History className="w-3 h-3" />
              </Button>
              
              {/* Show recent sessions as dots */}
              <div className="space-y-1 pt-1">
                {sessions.slice(0, 5).map((session) => (
                  <Button
                    key={session.id}
                    variant="ghost"
                    onClick={() => handleSessionSelect(session.id)}
                    className={cn(
                      "h-6 w-6 p-0 rounded-lg transition-all duration-200",
                      currentSessionId === session.id 
                        ? "bg-cyan-500/30 text-cyan-300 border border-cyan-400/50" 
                        : "text-cyan-400/60 hover:text-cyan-300 hover:bg-cyan-500/10"
                    )}
                    title={session.title}
                  >
                    <MessageSquare className="w-2.5 h-2.5" />
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Expanded state - show full content */}
          {isExpanded && (
            <>
              {/* History Section */}
              <div className="border-b border-cyan-500/20">
                <div className="flex items-center gap-2 p-3 text-cyan-400">
                  <History className="w-3 h-3" />
                  <span className="text-xs font-medium">History</span>
                </div>
              </div>
              
              {/* Sessions list */}
              <ScrollArea className="flex-1">
                <div className="p-1 space-y-1">
                  {sessions.length === 0 ? (
                    <div className="p-3 text-center text-cyan-400/60 text-xs">
                      No chat history yet
                    </div>
                  ) : (
                    sessions.map((session) => (
                      <div
                        key={session.id}
                        className={cn(
                          "group relative rounded-lg p-2 cursor-pointer transition-all duration-200",
                          "hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30",
                          currentSessionId === session.id && "bg-cyan-500/20 border-cyan-500/40"
                        )}
                        onClick={() => handleSessionSelect(session.id)}
                      >
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-3 h-3 mt-0.5 shrink-0 text-cyan-400" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate text-cyan-100">
                              {session.title}
                            </p>
                            <p className="text-xs text-cyan-400/60">
                              {format(session.updatedAt, 'MMM d')}
                            </p>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(session.id);
                          }}
                          className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </div>
    </>
  );
}