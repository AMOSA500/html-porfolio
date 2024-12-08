import dotenv from 'dotenv';
import exp from 'node:constants';
import { dot } from 'node:test/reporters';
dotenv.config();

const config = {
    env: process.env['ENV'] || 'development',
    port: process.env.PORT || 3000,
    forex: process.env['FOREX_KEY'],
    news: process.env['NEWS_KEY'],
    weather: process.env['WEATHER_KEY'],
};

export default config;