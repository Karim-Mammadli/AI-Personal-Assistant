'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Zap } from 'lucide-react';
import { SettingsDialog } from '@/components/settings/settings-dialog';

export function Header() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <header className="border-b border-cyan-500/20 bg-black/40 backdrop-blur-xl sticky top-0 z-30">
      <div className="flex items-center justify-between p-4">
        {/* Left side - NEXUS AI branding */}
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/25">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                NEXUS AI
              </h1>
            </div>
          </div>
          <p className="text-xs text-cyan-400/80 font-medium tracking-wide ml-10">
            ADVANCED NEURAL INTERFACE
          </p>
        </div>
        
        {/* Right side - Settings only */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSettingsOpen(true)}
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 rounded-lg"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  );
}