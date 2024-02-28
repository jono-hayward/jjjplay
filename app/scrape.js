import 'dotenv/config';

import { parse, searchAppleMusic, searchSpotify, searchYouTube } from './helpers.js';

import pkg from '@atproto/api';
const { BskyAgent, RichText } = pkg;

const config = {
  username: process.env.username,
  password: process.env.password,
  timezone: process.env.timezone,
};

const timeOptions = {
  timeStyle: 'short',
  timeZone: config.timezone,
};


const API = `https://music.abcradio.net.au/api/v1/plays/triplej/now.json?tz=${config.timezone}`;

const scrape = async () => fetch(API).then( response => response.json() );


const playing = await scrape();


// Bail out now if there's nothing playing
if ( !playing.now ) {
  console.error( 'No song currently playing' );
  process.exit(0);
}


const song = parse( playing.now );
console.log( 'Now playing', song );


const songDate = new Date( song.started );

const postObject = {
  langs: ['en-AU', 'en'],
  createdAt: songDate.toISOString(),
};

const lines = [
  song.title,
  `by ${song.artist}`,
];

if ( song.album !== song.title ) {
  lines.push( `from ${song.album}` );
}
// `${clockEmoji( config.timezone, song.started )} ${songDate.toLocaleTimeString( 'en-AU', timeOptions )}`,

const streamingLinks = [];

console.log( 'Searching Apple Music' );
const appleMusic = await searchAppleMusic( song );
appleMusic && streamingLinks.push({
  service: 'Apple Music',
  url: appleMusic,
});

console.log( 'Searching Spotify' );
const spotify = await searchSpotify( song );
spotify && streamingLinks.push({
  service: 'Spotify',
  url: spotify,
});

console.log( 'Searching YouTube Music' );
const yt = await searchYouTube( song );
yt && streamingLinks.push({
  service: 'YouTube Music',
  url: yt,
});

streamingLinks.length && lines.push(
  ``,
  `${streamingLinks.map( service => service.service ).join(' / ')}`
);

console.log( 'Logging in to Bluesky' );
const agent = new BskyAgent({ service: "https://bsky.social" });
await agent.login({
  identifier: config.username,
  password: config.password,
});

const rt = new RichText({ text: lines.join('\n') });

for ( const stream of streamingLinks ) {

  const serviceName = new RichText({ text: stream.service });

  const start = rt.text.search( serviceName.text );
  const end = start + serviceName.length;

  if ( !postObject.facets ) {
    postObject.facets = [];
  }

  postObject.facets.push({
    index: {
      byteStart: start,
      byteEnd: end
    },
    features: [{
      $type: 'app.bsky.richtext.facet#link',
      uri: stream.url
    }]
  });
}

postObject.text = rt.text;

if ( song.artwork ) {

  console.log( 'Grabbing and uploading song artwork to Bluesky' );
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

console.log( 'Posting' );
await agent.post( postObject );
console.log( 'Done!' );

process.exit(0);