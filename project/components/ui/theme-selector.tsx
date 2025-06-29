'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette, Check } from 'lucide-react';
import { useUITheme } from '@/hooks/use-ui-theme';

export function ThemeSelector() {
  const { currentTheme, availableThemes, changeTheme } = useUITheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Palette className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {availableThemes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => changeTheme(theme.id)}
            className="flex items-center justify-between"
          >
            <span>{theme.name}</span>
            {currentTheme.id === theme.id && (
              <Check className="w-4 h-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}