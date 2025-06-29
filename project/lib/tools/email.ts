import { google } from 'googleapis';
import { DynamicTool } from '@langchain/core/tools';
import { getOAuth2Client } from '../google';

async function sendEmail(gmail: any, auth: any, to: string, subject: string, message: string) {
  const rawMessage = [
    `From: me`,
    `To: ${to}`,
    `Subject: ${subject}`,
    '',
    message,
  ].join('\n');

  const encodedMessage = Buffer.from(rawMessage).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  await gmail.users.messages.send({
    auth,
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });

  return 'Email sent successfully.';
}

export const emailTool = new DynamicTool({
  name: 'google_email_tool',
  description: `
      Use this tool when dealing with the user's email. 
      It can send emails. The input should be a user's query about their email.
      Example: "send an email to test@example.com with the subject Hello and body Hi there".
  `,
  func: async (input: string) => {
    try {
      const auth = getOAuth2Client();
       if (!auth.credentials?.access_token) {
        return `User is not authenticated with Google. Please go to Settings > Google Authentication and connect your Google account to use email features.`;
      }
      const gmail = google.gmail({ version: 'v1', auth });

      // Simplified logic for tool use. A production system would use an LLM
      // call with function calling to extract parameters.
      if (input.toLowerCase().startsWith('send')) {
        const toMatch = input.match(/to\s+([^\s]+@[^\s]+)/);
        const subjectMatch = input.match(/subject\s+([^/]+)/);
        const bodyMatch = input.match(/body\s+(.+)/);

        if (toMatch && subjectMatch && bodyMatch) {
            return await sendEmail(gmail, auth, toMatch[1], subjectMatch[1].trim(), bodyMatch[1].trim());
        }
        return "Could not parse email details. Please specify 'to', 'subject', and 'body'.";
      }

      return 'Sorry, I can only send emails for now. To do so, please provide the recipient, subject, and body.';
    } catch (error: any) {
      console.error('Error with Google Email tool:', error);
      if (error.message?.includes('not configured')) {
        return 'Google API credentials are not configured. Please contact the administrator to set up Google integration.';
      }
      return 'Sorry, there was an error accessing Gmail. Please make sure you are authenticated.';
    }
  },
}); 