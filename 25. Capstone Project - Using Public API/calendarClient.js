import { google } from "googleapis";

const calendar = google.calendar('v3');

async function getWeeklyEvents(auth) {
  const now = new Date();
  
  // Calculate the start of the week (Monday 00:00)
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Calculate the end of the week (Sunday 23:59)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  try {
    const response = await calendar.events.list({
      auth: auth,
      calendarId: 'primary',
      timeMin: startOfWeek.toISOString(),
      timeMax: endOfWeek.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items;
    if (events.length) {
      console.log('Upcoming events this week:');
      events.forEach((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log('No upcoming events found.');
    }
    
    return events;
  } catch (error) {
    console.error('Error retrieving events:', error);
  }
}

export default getWeeklyEvents;
