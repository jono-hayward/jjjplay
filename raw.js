import 'dotenv/config';

import { parse } from './helpers.js';

const config = {
  timezone: process.env.timezone,
};

const timeOptions = {
  timeStyle: 'short',
  timeZone: config.timezone,
};

const API = `https://music.abcradio.net.au/api/v1/plays/triplej/now.json?tz=${config.timezone}`;
const scrape = async () => fetch( API ).then( response => response.json() );

const playing = await scrape();
console.log( playing.now, parse( playing.now ) );
