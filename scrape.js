import 'dotenv/config';
import agent from '@atproto/api';
const { BskyAgent, RichText } = agent;

import * as fs from 'fs';

import { clockEmoji, parse } from './helpers.js';

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

if ( now.now && now.now.recording ) {

  const song = parse( now.now );
  console.log( 'Now', song );

  const agent = new BskyAgent({ service: "https://bsky.social" });
  await agent.login({
    identifier: config.username,
    password: config.password,
  });

  const songDate = new Date( song.started );

  const postObject = {
    langs: ['en-AU', 'en'],
    createdAt: songDate.toISOString(),
    text: 
`🎵 ${song.title}
🧑‍🎤 ${song.artist}
💿 ${song.album}

${clockEmoji( config.timezone, song.started )} ${songDate.toLocaleTimeString( 'en-AU', timeOptions )}`,
  };

  if ( song.artwork ) {

    const response = await fetch( song.artwork );

    const buffer = await response.arrayBuffer();

    const { data } = await agent.uploadBlob( new Uint8Array( buffer ), { encoding: 'image/jpeg' } );

    postObject.embed = {
      $type: 'app.bsky.embed.images',
      images: [{
        alt: `Album artwork for "${song.album}" by ${song.artist}`,
        image: data.blob,
        aspectRatio: {
          width: 1,
          height: 1,
        }
      }]
    };
  }

  await agent.post( postObject );
} else {
  console.log( 'No song currently playing' );
}