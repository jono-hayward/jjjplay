import 'dotenv/config';

import agent from '@atproto/api';
const { BskyAgent, RichText } = agent;


const config = {
  username: process.env.username,
  password: process.env.password,
  timezone: process.env.timezone,
};

const API = `https://music.abcradio.net.au/api/v1/plays/triplej/now.json?tz=${config.timezone}`;

const scrape = async () => fetch(API).then( response => response.json());

const timeOptions = {
  timeStyle: 'short',
  timeZone: config.timezone,
};

let now = await scrape();

if ( now.now && now.now.recording ) {
  const song = {
    started: new Date(now.now.played_time).toLocaleTimeString('en-AU', timeOptions),
    title: now.now.recording.title,
    artist: now.now.recording.artists[0].name,
    album: now.now.release.title,
    artwork: now.now.release.artwork[0].url
  };

  console.log( song );
} else {
  console.log( now );
}