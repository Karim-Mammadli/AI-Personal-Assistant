'use client';

import { ChatInterface } from '@/components/chat/chat-interface';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { useChatSessions } from '@/hooks/use-chat-sessions';

export default function Home() {
  const {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    createNewSession,
    deleteSession,
  } = useChatSessions();

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSessionSelect={setCurrentSessionId}
          onNewSession={createNewSession}
          onDeleteSession={deleteSession}
        />
        <main className="flex-1 overflow-hidden">
          <ChatInterface />
        </main>
      </div>
    </div>
  );
}