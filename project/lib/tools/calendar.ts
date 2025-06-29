import { google } from 'googleapis';
import { DynamicTool } from '@langchain/core/tools';
import { getOAuth2Client } from '../google';

async function listEvents(calendar: any, auth: any, query: string) {
  // A simple heuristic to get a time range, a real implementation would be more robust
  const timeMin = new Date();
  const timeMax = new Date();
  timeMax.setDate(timeMax.getDate() + 7);

  const res = await calendar.events.list({
    auth,
    calendarId: 'primary',
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
    q: query
  });
  return res.data.items;
}

async function createEvent(calendar: any, auth: any, summary: string, start: string, end: string, description: string) {
    const event = {
        summary,
        description,
        start: { dateTime: new Date(start).toISOString(), timeZone: 'America/New_York' },
        end: { dateTime: new Date(end).toISOString(), timeZone: 'America/New_York' }
    };

    const res = await calendar.events.insert({
        auth,
        calendarId: 'primary',
        requestBody: event,
    });
    return res.data;
}

export const calendarTool = new DynamicTool({
  name: 'google_calendar_tool',
  description: `
    Use this tool to do anything with a user's Google Calendar. 
    Actions include creating, listing, and searching for events. 
    Input should be a user's query about their calendar.
    Examples: "what's on my calendar tomorrow?", "create an event for a meeting next Friday at 2pm".
  `,
  func: async (input: string) => {
    try {
      const auth = getOAuth2Client();
      if (!auth.credentials?.access_token) {
        return `User is not authenticated with Google. Please go to Settings > Google Authentication and connect your Google account to use calendar features.`;
      }
      
      const calendar = google.calendar({ version: 'v3', auth });
      
      // Here you can add more sophisticated logic to parse the input and
      // decide which calendar function to call (create, list, delete, etc.)
      // For this example, we'll default to listing events based on the query.
      if (input.toLowerCase().includes('create') || input.toLowerCase().includes('add')) {
          // This is a simplified example. A real implementation would use another LLM call
          // or a more robust parser to extract event details (summary, start, end).
          const summary = `New Event from query: "${input}"`;
          const startTime = new Date();
          startTime.setHours(startTime.getHours() + 1);
          const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

          const result = await createEvent(calendar, auth, summary, startTime.toISOString(), endTime.toISOString(), input);
          return `Event created successfully: ${result.summary} at ${new Date(result.start.dateTime).toLocaleString()}`;
      } else {
          const events = await listEvents(calendar, auth, input);
          if (!events || events.length === 0) {
              return 'No upcoming events found.';
          }
          const eventList = events.map((event: any) => `${new Date(event.start.dateTime).toLocaleString()}: ${event.summary}`).join('\n');
          return `Here are the upcoming events:\n${eventList}`;
      }

    } catch (error: any) {
      console.error('Error with Google Calendar tool:', error);
      if (error.message?.includes('not configured')) {
        return 'Google API credentials are not configured. Please contact the administrator to set up Google integration.';
      }
      return 'Sorry, there was an error accessing Google Calendar. Please make sure you are authenticated.';
    }
  },
}); 