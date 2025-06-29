import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'AI Personal Assistant',
  description: 'Your intelligent personal assistant for email, calendar, and more',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}