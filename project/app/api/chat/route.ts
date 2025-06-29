import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { AIMessage, HumanMessage } from '@langchain/core/messages';

import { calendarTool } from '@/lib/tools/calendar';
import { emailTool } from '@/lib/tools/email';
import { getGoogleAuthUrl, setGoogleCredentials, getOAuth2Client } from '@/lib/google';

export const dynamic = 'force-dynamic';

const AGENT_PROMPT = ChatPromptTemplate.fromMessages([
  ['system', 'You are a helpful AI personal assistant. You have access to tools for Google Calendar and Gmail. Be concise and friendly.'],
  new MessagesPlaceholder('chat_history'),
  ['human', '{input}'],
  new MessagesPlaceholder('agent_scratchpad'),
]);

// This is a simple in-memory check. In a real app, use a proper session store.
let googleAuthCheckDone = false; 

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    // Check for Google Auth on the first message of a session
    if (!googleAuthCheckDone) {
        const auth = getOAuth2Client();
        if(!auth.credentials.access_token) {
            const authUrl = getGoogleAuthUrl();
            return NextResponse.json({ 
                message: `Please authorize the application to access your Google services by visiting this URL: ${authUrl}`,
                authUrl: authUrl // Send the URL to the frontend
            });
        }
        googleAuthCheckDone = true;
    }

    const apiKey = request.headers.get('x-openai-key') || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 400 }
      );
    }

    const model = new ChatOpenAI({
      apiKey: apiKey,
      model: 'gpt-4o-mini', // Using a model that supports function calling well
      temperature: 0.7,
    });
    
    const tools = [calendarTool, emailTool];

    const agent = await createOpenAIFunctionsAgent({
      llm: model,
      tools,
      prompt: AGENT_PROMPT,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
    });
    
    const chat_history = history.map((msg: { role: string, content: string }) => 
        msg.role === 'user' 
            ? new HumanMessage(msg.content) 
            : new AIMessage(msg.content)
    );

    const result = await agentExecutor.invoke({
      input: message,
      chat_history: chat_history,
    });

    return NextResponse.json({ message: result.output });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add an API route to handle the Google OAuth callback
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (request.nextUrl.pathname === '/api/auth/callback/google' && code) {
        const oAuth2Client = getOAuth2Client();
        try {
            const { tokens } = await oAuth2Client.getToken(code);
            setGoogleCredentials(tokens); // Store tokens
            oAuth2Client.setCredentials(tokens);

            // Redirect user back to the chat interface
            const redirectUrl = new URL('/', request.url);
            return NextResponse.redirect(redirectUrl.toString());
        } catch(error) {
            console.error('Error getting auth token', error);
             return NextResponse.json(
                { error: 'Failed to authenticate with Google' },
                { status: 500 }
            );
        }
    }
    
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}