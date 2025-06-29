import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();
    
    // Get API key from headers or environment
    const apiKey = request.headers.get('x-openai-key') || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 400 }
      );
    }

    // Default OpenAI response
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI personal assistant. Be concise and friendly.',
          },
          ...history.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          })),
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content || 'Sorry, I could not process your request.';

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}