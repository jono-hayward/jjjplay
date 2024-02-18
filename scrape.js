import 'dotenv/config';

import agent from '@atproto/api';
const { BskyAgent, RichText } = agent;

import { clockEmoji } from './helpers.js';


const config = {
  username: process.env.username,
  password: process.env.password,
  timezone: process.env.timezone,
};

const API = `https://music.abcradio.net.au/api/v1/plays/triplej/now.json?tz=${config.timezone}`;

const scrape = async () => fetch( API ).then( response => response.json() );

const timeOptions = {
  timeStyle: 'short',
  timeZone: config.timezone,
};

let now = await scrape();

const parse = song => ({
  started: song.played_time,
  title: song.recording.title,
  artist: song.recording.artists[0].name,
  album: song.release.title,
  artwork: song.release.artwork[0].url
});

if ( now.now && now.now.recording ) {
  const song = parse( now.now );
  console.log( 'Now', song );

  const agent = new BskyAgent({ service: "https://bsky.social" });
  await agent.login({
    identifier: config.username,
    password: config.password,
  });

  await agent.post({
    text:
`🎵 ${song.title}
🧑‍🎤 ${song.artist}
💿 ${song.album}

${clockEmoji( config.timezone, song.started )} ${new Date( song.started ).toLocaleTimeString( 'en-AU', timeOptions )}`
  })
}

if ( now.prev && now.prev.recording ) {
  console.log( 'Prev', parse ( now.prev ) );
}

