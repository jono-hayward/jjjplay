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

const parse = song => ({
  started: new Date(song.played_time).toLocaleTimeString('en-AU', timeOptions),
  title: song.recording.title,
  artist: song.recording.artists[0].name,
  album: song.release.title,
  artwork: song.release.artwork[0].url
});

if ( now.now && now.now.recording ) {
  console.log( 'Now', parse( now.now ) );
}
if ( now.prev && now.prev.recording ) {
  console.log( 'Prev', parse ( now.prev ) );
}