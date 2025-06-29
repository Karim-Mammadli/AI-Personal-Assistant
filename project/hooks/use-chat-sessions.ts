'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChatSession, Message } from '@/types/chat';

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Load sessions from localStorage
    const savedSessions = localStorage.getItem('chat-sessions');
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
      setSessions(parsedSessions);
      
      if (parsedSessions.length > 0 && !currentSessionId) {
        setCurrentSessionId(parsedSessions[0].id);
      }
    }
  }, [currentSessionId]);

  const saveSessionsToStorage = useCallback((updatedSessions: ChatSession[]) => {
    localStorage.setItem('chat-sessions', JSON.stringify(updatedSessions));
    setSessions(updatedSessions);
  }, []);

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedSessions = [newSession, ...sessions];
    saveSessionsToStorage(updatedSessions);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  }, [sessions, saveSessionsToStorage]);

  const updateSession = useCallback((sessionId: string, updates: Partial<ChatSession>) => {
    const updatedSessions = sessions.map(session =>
      session.id === sessionId
        ? { ...session, ...updates, updatedAt: new Date() }
        : session
    );
    saveSessionsToStorage(updatedSessions);
  }, [sessions, saveSessionsToStorage]);

  const deleteSession = useCallback((sessionId: string) => {
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    saveSessionsToStorage(updatedSessions);
    
    if (currentSessionId === sessionId) {
      setCurrentSessionId(updatedSessions.length > 0 ? updatedSessions[0].id : null);
    }
  }, [sessions, currentSessionId, saveSessionsToStorage]);

  const addMessageToSession = useCallback((sessionId: string, message: Message) => {
    updateSession(sessionId, {
      messages: [...(sessions.find(s => s.id === sessionId)?.messages || []), message],
      title: sessions.find(s => s.id === sessionId)?.messages.length === 0 
        ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
        : sessions.find(s => s.id === sessionId)?.title
    });
  }, [sessions, updateSession]);

  const getCurrentSession = useCallback(() => {
    return sessions.find(session => session.id === currentSessionId) || null;
  }, [sessions, currentSessionId]);

  return {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    createNewSession,
    updateSession,
    deleteSession,
    addMessageToSession,
    getCurrentSession,
  };
}