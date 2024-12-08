import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import dateFormat from 'dateformat';
import { authorize, listEvents, listFiles, listEventsFromSubscribedCalendars, SCOPES } from './googleAPI.js';
import { getWeatherData } from './weather.js';
import config from './config/config.js';

// Rest of your code...

const app = express();
const port = config.port;
const verified = true;
const access_key = config.forex; // Forex API access key
const news_api_key = config.news; // News API access key


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Root route
app.get('/', async (req, res) => {
  if (verified) {
    try {
      // Google API Authorization
      const auth = await authorize();
      const calendar = await listEventsFromSubscribedCalendars(auth);
      const files = await listFiles(auth);

      // Format calendar events
      calendar.forEach(event => {
        event.start = dateFormat(event.start, "mmmm d, yyyy, h:MM:ss TT");
      });

      // Weather API
      const weatherData = await getWeatherData();

      // Forex API
      const forex = await axios.get(`https://api.exchangeratesapi.io/v1/latest?access_key=${access_key}&symbols=USD,GBP`); 

      // Quote API
      const quote = await axios.get("https://programming-quotesapi.vercel.app/api/random");

      // News API
      const news = await axios.get(`https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${news_api_key}`);

      // Render index.ejs
      res.render("index.ejs", { 
        events: calendar, 
        temp: weatherData[0].main.temp, 
        weather: weatherData[0].weather,
        drive: files,
        forex: forex.data.rates,
        quote: quote.data,
        news: news.data.results[0]
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Authentication failed');
    }
  } else {
    res.render("index.ejs");
  }
});

// OAuth2 callback route
app.get('/oauth2callback', async (req, res) => {
  try {
    const code = req.query.code;
    const auth = await authorize();
    const { tokens } = await auth.getToken(code);
    auth.setCredentials(tokens);
    const events = await listEvents(auth);
    res.render("index.ejs", { events });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error during OAuth2 callback");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
