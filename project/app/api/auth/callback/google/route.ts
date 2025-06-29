import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { setGoogleCredentials } from '@/lib/google';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:3000/api/auth/callback/google'
    );

    const { tokens } = await oauth2Client.getToken(code);
    setGoogleCredentials(tokens);

    // Redirect back to the main app with success
    return NextResponse.redirect(new URL('/?auth=success', request.url));
  } catch (error) {
    console.error('Error getting tokens:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
} 