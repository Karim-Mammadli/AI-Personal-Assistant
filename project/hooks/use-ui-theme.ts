'use client';

import { useState, useEffect } from 'react';
import { UITheme } from '@/types/chat';

const defaultThemes: UITheme[] = [
  {
    id: 'default',
    name: 'Default',
    fontFamily: 'Inter',
    accentColor: '#000000',
  },
  {
    id: 'cyber',
    name: 'Cyber Form',
    // TODO: Add your custom background here
    // Example: background: 'https://your-image-url.com/cyber-bg.gif',
    // Example: background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
    background: undefined, // Set to default for now
    backgroundType: undefined, // Set to default for now
    chatOpacity: 0.9,
    fontFamily: 'Inter', // Changed from monospace to prevent font issues
    accentColor: '#00ff41',
  },
  {
    id: 'space',
    name: 'Space',
    // TODO: Add your custom space background here
    // Example: background: 'https://your-image-url.com/space-bg.jpg',
    background: undefined, // Set to default for now
    backgroundType: undefined, // Set to default for now
    chatOpacity: 0.8,
    fontFamily: 'Inter',
    accentColor: '#4f46e5',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    // TODO: Add your custom ocean background here
    // Example: background: 'https://your-image-url.com/ocean-bg.jpg',
    background: undefined, // Set to default for now
    backgroundType: undefined, // Set to default for now
    chatOpacity: 0.85,
    fontFamily: 'Inter',
    accentColor: '#0ea5e9',
  },
  {
    id: 'forest',
    name: 'Forest',
    // TODO: Add your custom forest background here
    // Example: background: 'https://your-image-url.com/forest-bg.jpg',
    background: undefined, // Set to default for now
    backgroundType: undefined, // Set to default for now
    chatOpacity: 0.9,
    fontFamily: 'Inter',
    accentColor: '#059669',
  },
];

export function useUITheme() {
  const [currentTheme, setCurrentTheme] = useState<UITheme>(defaultThemes[0]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('ui-theme');
    if (savedTheme) {
      const theme = defaultThemes.find(t => t.id === savedTheme) || defaultThemes[0];
      setCurrentTheme(theme);
      applyTheme(theme);
    }
  }, []);

  const applyTheme = (theme: UITheme) => {
    const root = document.documentElement;
    
    // Apply font family
    if (theme.fontFamily) {
      root.style.setProperty('--font-family', theme.fontFamily);
    }
    
    // Apply accent color
    if (theme.accentColor) {
      root.style.setProperty('--accent-color', theme.accentColor);
    }
    
    // Apply background
    const body = document.body;
    if (theme.background && theme.backgroundType) {
      switch (theme.backgroundType) {
        case 'color':
          body.style.background = theme.background;
          body.style.backgroundImage = '';
          break;
        case 'image':
        case 'gif':
          body.style.backgroundImage = `url(${theme.background})`;
          body.style.backgroundSize = 'cover';
          body.style.backgroundPosition = 'center';
          body.style.backgroundRepeat = 'no-repeat';
          body.style.backgroundAttachment = 'fixed';
          body.style.background = '';
          break;
      }
    } else {
      // Reset to default background
      body.style.background = '';
      body.style.backgroundImage = '';
      body.style.backgroundSize = '';
      body.style.backgroundPosition = '';
      body.style.backgroundRepeat = '';
      body.style.backgroundAttachment = '';
    }
    
    // Apply chat opacity
    if (theme.chatOpacity !== undefined) {
      root.style.setProperty('--chat-opacity', theme.chatOpacity.toString());
    }
  };

  const changeTheme = (themeId: string) => {
    const theme = defaultThemes.find(t => t.id === themeId) || defaultThemes[0];
    setCurrentTheme(theme);
    applyTheme(theme);
    localStorage.setItem('ui-theme', themeId);
  };

  return {
    currentTheme,
    availableThemes: defaultThemes,
    changeTheme,
  };
}