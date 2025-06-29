'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApiKeysTab } from './api-keys-tab';
import { Key, Palette, Zap } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-black/95 backdrop-blur-xl border-cyan-500/30 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-cyan-100">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/25">
              <Zap className="w-4 h-4 text-black" />
            </div>
            NEXUS AI Settings
          </DialogTitle>
          <DialogDescription className="text-cyan-400/80">
            Configure your AI assistant preferences, API keys, and system settings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 overflow-hidden">
          <Tabs defaultValue="api" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-cyan-500/20">
              <TabsTrigger 
                value="api" 
                className="gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-100 text-cyan-400 hover:text-cyan-300"
              >
                <Key className="w-4 h-4" />
                API Configuration
              </TabsTrigger>
              <TabsTrigger 
                value="appearance" 
                className="gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-100 text-cyan-400 hover:text-cyan-300"
              >
                <Palette className="w-4 h-4" />
                Appearance
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-4 overflow-hidden">
              <TabsContent value="api" className="space-y-4 m-0 overflow-hidden">
                <ApiKeysTab />
              </TabsContent>
              
              <TabsContent value="appearance" className="space-y-4 m-0">
                <div className="space-y-4 p-6">
                  <div className="text-sm text-cyan-400/80 bg-black/20 p-4 rounded-lg border border-cyan-500/20">
                    Customize the appearance and theme of your AI assistant interface.
                  </div>
                  
                  <div className="text-center py-12 text-cyan-400/60 bg-black/20 rounded-lg border border-cyan-500/20">
                    <Palette className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2 text-cyan-300">Appearance Customization</h3>
                    <p className="mb-2">Advanced theme options coming soon...</p>
                    <p className="text-xs opacity-75">Stay tuned for custom color schemes, background options, and layout preferences.</p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}