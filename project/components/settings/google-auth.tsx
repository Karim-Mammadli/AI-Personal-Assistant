'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function GoogleAuth() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'success') {
      setIsAuthenticated(true);
      toast.success('Successfully authenticated with Google!');
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('error')) {
      toast.error('Authentication failed. Please try again.');
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleGoogleAuth = async () => {
    setIsAuthenticating(true);
    try {
      const response = await fetch('/api/auth/google');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.authUrl) {
        // Open Google OAuth in a new window
        const authWindow = window.open(
          data.authUrl, 
          'google-auth', 
          'width=500,height=600,scrollbars=yes,resizable=yes'
        );
        
        if (!authWindow) {
          throw new Error('Popup blocked. Please allow popups for this site.');
        }
        
        // Listen for the callback
        const checkAuth = setInterval(() => {
          try {
            if (authWindow.closed) {
              clearInterval(checkAuth);
              setIsAuthenticating(false);
              
              // Check if authentication was successful by checking the current URL
              const urlParams = new URLSearchParams(window.location.search);
              if (urlParams.get('auth') === 'success') {
                setIsAuthenticated(true);
                toast.success('Successfully authenticated with Google!');
                // Clean up the URL
                window.history.replaceState({}, document.title, window.location.pathname);
              } else if (urlParams.get('error')) {
                toast.error('Authentication failed. Please try again.');
                // Clean up the URL
                window.history.replaceState({}, document.title, window.location.pathname);
              }
            }
          } catch (error) {
            console.error('Error checking auth window:', error);
            clearInterval(checkAuth);
            setIsAuthenticating(false);
          }
        }, 1000);
        
        // Timeout after 5 minutes
        setTimeout(() => {
          clearInterval(checkAuth);
          if (!authWindow.closed) {
            authWindow.close();
          }
          setIsAuthenticating(false);
          toast.error('Authentication timed out. Please try again.');
        }, 300000);
        
      } else {
        throw new Error('Failed to get authentication URL');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start authentication process');
      setIsAuthenticating(false);
    }
  };

  return (
    <Card className="bg-black/40 border-cyan-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-100">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-red-500 to-blue-500">
            <Mail className="w-4 h-4 text-white" />
          </div>
          Google Services Authentication
        </CardTitle>
        <CardDescription className="text-cyan-400/70">
          Connect your Google account to enable Gmail and Calendar features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-cyan-500/20">
          <Mail className="w-5 h-5 text-cyan-400" />
          <div className="flex-1">
            <div className="text-sm font-medium text-cyan-100">Gmail Access</div>
            <div className="text-xs text-cyan-400/70">Send emails through your Gmail account</div>
          </div>
          {isAuthenticated ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          )}
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-cyan-500/20">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <div className="flex-1">
            <div className="text-sm font-medium text-cyan-100">Google Calendar</div>
            <div className="text-xs text-cyan-400/70">Create and manage calendar events</div>
          </div>
          {isAuthenticated ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          )}
        </div>

        <Button
          onClick={handleGoogleAuth}
          disabled={isAuthenticating || isAuthenticated}
          className="w-full gap-2 bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-400 hover:to-blue-400 text-white font-medium transition-all duration-200 shadow-lg shadow-red-500/25"
        >
          {isAuthenticating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Authenticating...
            </>
          ) : isAuthenticated ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Authenticated
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              Connect Google Account
            </>
          )}
        </Button>

        {isAuthenticated && (
          <div className="text-xs text-green-400/80 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
            ✓ Your Google account is connected. You can now use Gmail and Calendar features in the chat.
          </div>
        )}

        <div className="text-xs text-cyan-400/60 bg-black/20 p-3 rounded-lg border border-cyan-500/20">
          <strong>Note:</strong> Make sure you have configured your Google API credentials in the environment variables (GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET).
        </div>
      </CardContent>
    </Card>
  );
} 