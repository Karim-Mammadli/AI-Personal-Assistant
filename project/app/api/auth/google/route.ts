import { NextResponse } from 'next/server';
import { getGoogleAuthUrl } from '@/lib/google';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const authUrl = getGoogleAuthUrl();
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication URL' },
      { status: 500 }
    );
  }
} 