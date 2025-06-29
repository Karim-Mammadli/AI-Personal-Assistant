'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, EyeOff, Save, Key, Bot, Zap, Brain, Cpu, Database, Globe, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export function ApiKeysTab() {
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    gemini: '',
    cohere: '',
    huggingface: '',
    replicate: '',
    stability: '',
    elevenlabs: ''
  });
  
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load API keys from localStorage
    setApiKeys({
      openai: localStorage.getItem('openai-api-key') || '',
      anthropic: localStorage.getItem('anthropic-api-key') || '',
      gemini: localStorage.getItem('gemini-api-key') || '',
      cohere: localStorage.getItem('cohere-api-key') || '',
      huggingface: localStorage.getItem('huggingface-api-key') || '',
      replicate: localStorage.getItem('replicate-api-key') || '',
      stability: localStorage.getItem('stability-api-key') || '',
      elevenlabs: localStorage.getItem('elevenlabs-api-key') || ''
    });
  }, []);

  const handleSave = () => {
    Object.entries(apiKeys).forEach(([key, value]) => {
      localStorage.setItem(`${key}-api-key`, value);
      console.log(`[ApiKeysTab] Stored in localStorage: ${key}-api-key = ${value ? '***** (hidden)' : 'empty'}`);
    });
    toast.success('API keys saved successfully');
    window.dispatchEvent(new CustomEvent('api-key-saved'));
    console.log('[ApiKeysTab] Dispatched custom event: api-key-saved');
  };

  const toggleShowKey = (keyName: string) => {
    setShowKeys(prev => ({ ...prev, [keyName]: !prev[keyName] }));
  };

  const updateApiKey = (service: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [service]: value }));
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const apiServices = [
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'GPT-4, GPT-3.5, DALL-E, Whisper, and more',
      icon: Bot,
      placeholder: 'sk-...',
      color: 'from-green-500 to-emerald-500',
      required: true,
      link: 'https://platform.openai.com/api-keys'
    },
    {
      id: 'anthropic',
      name: 'Anthropic Claude',
      description: 'Claude 3 Opus, Sonnet, and Haiku models',
      icon: Brain,
      placeholder: 'sk-ant-...',
      color: 'from-orange-500 to-red-500',
      link: 'https://console.anthropic.com/'
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      description: 'Gemini Pro and Ultra models',
      icon: Zap,
      placeholder: 'AIza...',
      color: 'from-blue-500 to-indigo-500',
      link: 'https://makersuite.google.com/app/apikey'
    },
    {
      id: 'cohere',
      name: 'Cohere',
      description: 'Command and Embed models',
      icon: Cpu,
      placeholder: 'co-...',
      color: 'from-purple-500 to-pink-500',
      link: 'https://dashboard.cohere.ai/api-keys'
    },
    {
      id: 'huggingface',
      name: 'Hugging Face',
      description: 'Access to thousands of open-source models',
      icon: Database,
      placeholder: 'hf_...',
      color: 'from-yellow-500 to-orange-500',
      link: 'https://huggingface.co/settings/tokens'
    },
    {
      id: 'replicate',
      name: 'Replicate',
      description: 'Run machine learning models in the cloud',
      icon: Globe,
      placeholder: 'r8_...',
      color: 'from-teal-500 to-cyan-500',
      link: 'https://replicate.com/account/api-tokens'
    },
    {
      id: 'stability',
      name: 'Stability AI',
      description: 'Stable Diffusion and other generative models',
      icon: Key,
      placeholder: 'sk-...',
      color: 'from-indigo-500 to-purple-500',
      link: 'https://platform.stability.ai/account/keys'
    },
    {
      id: 'elevenlabs',
      name: 'ElevenLabs',
      description: 'AI voice generation and speech synthesis',
      icon: Bot,
      placeholder: 'el_...',
      color: 'from-pink-500 to-rose-500',
      link: 'https://elevenlabs.io/app/settings/api-keys'
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable API keys section */}
      <div className="flex-grow max-h-[50vh] overflow-y-auto space-y-4 pr-2">
        {apiServices.map((service) => {
          const IconComponent = service.icon;
          return (
            <Card key={service.id} className="relative bg-black/40 border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r ${service.color} shadow-lg`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base text-cyan-100">{service.name}</CardTitle>
                      {service.required && (
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                          Required
                        </span>
                      )}
                    </div>
                    <CardDescription className="text-sm text-cyan-400/70">{service.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    id={`${service.id}-key`}
                    type={showKeys[service.id] ? 'text' : 'password'}
                    value={apiKeys[service.id as keyof typeof apiKeys]}
                    onChange={(e) => {
                      console.log('Input changed:', service.id, e.target.value);
                      updateApiKey(service.id, e.target.value);
                    }}
                    placeholder={`Enter your ${service.name} API key (${service.placeholder})`}
                    className="font-mono text-sm bg-white/10 border border-cyan-500/50 text-white placeholder:text-gray-400 flex-grow"
                    autoComplete="off"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toggleShowKey(service.id)}
                    className="px-3 bg-black/20 border-cyan-500/30 hover:border-cyan-400/50 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                  >
                    {showKeys[service.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => openLink(service.link)}
                    className="text-xs gap-1 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 px-2 py-1 h-auto"
                    title={`Open ${service.name} Dashboard`}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Save Button Footer - always visible, outside scroll */}
      <div className="w-full bg-black/90 pt-4 pb-4 flex justify-end z-20 border-t border-cyan-500/20 mt-4">
        <Button 
          type="button"
          onClick={handleSave}
          className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-medium transition-all duration-200 shadow-lg shadow-cyan-500/25"
        >
          <Save className="w-4 h-4" />
          Save All API Keys
        </Button>
      </div>
    </div>
  );
}
