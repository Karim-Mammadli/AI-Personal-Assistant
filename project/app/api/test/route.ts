import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
  });
} 