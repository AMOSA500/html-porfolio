import fs  from 'fs/promises';
import path from 'path';
import process from 'process';
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';


const SCOPES = [
                'https://www.googleapis.com/auth/calendar.readonly',
                'https://www.googleapis.com/auth/drive.metadata.readonly',
                'https://www.googleapis.com/auth/drive.file',
];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const calDictionary = [];

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}


 


/**
 * Lists the names and IDs of up to 10 files.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
async function listFiles(authClient) {
  const drive = google.drive({version: 'v3', auth: authClient});
  const res = await drive.files.list({
    pageSize: 20,
    fields: 'nextPageToken, files(id, name)',
  });

  const files = res.data.files;
  if (files.length === 0) {
    console.log('No files found.');
    return;
  }

  // Filter out the files that are not doc or pdf
  const filteredFiles = files.filter(file => {
    const extension = file.name.split('.').pop().toLowerCase();
    return extension === 'doc' || extension === 'pdf' || extension === 'docx' || extension === 'xlsx';
  });

  if (filteredFiles.length === 0) {
    console.log('No .docx or .pdf files found.');
    return;
  }

  return filteredFiles;
}

// Function to list the upcoming events from all calendars the user is subscribed to
async function listEventsFromSubscribedCalendars(auth) {
  const calendar = google.calendar({ version: 'v3', auth });

  try {
    // Get the list of all calendars the user is subscribed to
    const calendarListResponse = await calendar.calendarList.list();
    const calendars = calendarListResponse.data.items;

    if (calendars.length) {
      // Filter to get only subscribed (non-primary) calendars
      const subscribedCalendars = calendars.filter(cal => !cal.primary);
      
      if (subscribedCalendars.length) {
        for (const cal of subscribedCalendars) {
          // await listEvents(auth, cal.id);
          const eventsResponse = await calendar.events.list({
            calendarId: cal.id,
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
          });
      
          const events = eventsResponse.data.items;
          if (events && events.length) {
           
            events.map((event, i) => {
              const start = new Date(event.start.dateTime || event.start.date);
              // add event to dictionary
              calDictionary.push({start: start, summary: event.summary, description: event.description});
             
            });
            // sort calDictionary using start date
            calDictionary.sort((a, b) => a.start - b.start);
          } else {
            console.log(`No upcoming events found in calendar ${cal.id}.`);
          }
        } 
        return calDictionary;
      } else {
        console.log('No subscribed calendars found.');
      }
    } else {
      console.log('No calendars found.');
    }
  } catch (error) {
    console.error('Error fetching calendar list:', error);
  }
}


/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

async function listEvents(auth, calendarId="primary") {
  const calendar = google.calendar({ version: 'v3', auth });

  try {
    const eventsResponse = await calendar.events.list({
      calendarId: calendarId,
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = eventsResponse.data.items;
    if (events.length) {
      console.log(`Upcoming events in ${calendarId}:`);
      events.map((event, i) => {
        const start = new Date(event.start.dateTime || event.start.date);
        // add event to dictionary
        calDictionary.push({start: start, summary: event.summary, description: event.description});
        //console.log(`${start} - ${event.summary} - ${event.description}`);
      });
      // sort calDictionary using start date
      calDictionary.sort((a, b) => a.start - b.start);
      
      return calDictionary;
    } else {
      console.log(`No upcoming events found in calendar ${calendarId}.`);
    }
  } catch (error) {
    console.error(`Error fetching events from calendar ${calendarId}:`, error);
  }
}


export {authorize, listEvents, listFiles, listEventsFromSubscribedCalendars, SCOPES};