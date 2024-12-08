import { Navigator } from 'node-navigator';
import axios from 'axios';
import config from './config/config.js';

const weather_api_key = config.weather;

// Initialize the navigator
const navigator = new Navigator();

// Function to get the user's current location
function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (position) {
          const latitude = position.latitude;
          const longitude = position.longitude;
          resolve({ latitude, longitude });
        } else {
          reject(new Error("Position is null."));
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
}

// Function to fetch weather data using the location
async function getWeatherData(latitude, longitude) {
  try {
    const weather = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${weather_api_key}`
    );
    return weather.data.list;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

// Main function to get location and then fetch weather data
async function main() {
  try {
    const location = await getLocation();
    const weatherData = await getWeatherData(location.latitude, location.longitude);
   
    return weatherData;
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main();

export { main as getWeatherData };
