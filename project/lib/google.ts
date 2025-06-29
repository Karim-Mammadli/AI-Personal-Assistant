import { google } from 'googleapis';

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/gmail.modify',
];

// This would typically be stored in a database associated with the user
// For this example, we'll keep it simple.
let tokens: any = {};

export function getOAuth2Client() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Google API credentials not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment variables.');
  }

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    // This should match the redirect URI in your Google Cloud project
    'http://localhost:3000/api/auth/callback/google' 
  );
  
  // Set credentials if we have them
  if (Object.keys(tokens).length) {
    oAuth2Client.setCredentials(tokens);
  }

  return oAuth2Client;
}

export function setGoogleCredentials(newTokens: any) {
    tokens = newTokens;
}

export function getGoogleAuthUrl() {
    const oAuth2Client = getOAuth2Client();
    return oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
}

export function isAuthenticated() {
    return Object.keys(tokens).length > 0 && tokens.access_token;
} 