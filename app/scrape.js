import 'dotenv/config';

import {
  parse,
  findByteRange,
  searchAppleMusic,
  searchSpotify,
  searchYouTube,
  clockEmoji
} from './helpers.js';

import pkg from '@atproto/api';
const { BskyAgent } = pkg;

const config = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  timezone: process.env.TIMEZONE,
};

const timeOptions = {
  timeStyle: 'short',
  timeZone: config.timezone,
};


const API = `https://music.abcradio.net.au/api/v1/plays/triplej/now.json?tz=${config.timezone}`;

const scrape = async () => fetch(API).then( response => response.json() );
const playing = await scrape();


// Bail out now if there's nothing playing
if ( !playing.now || !playing.now.recording ) {
  console.error( 'No song currently playing' );
  process.exit(0);
}

const song = parse( playing.now );
const songDate = new Date( song.started );

console.log( '💿 Now playing', song );

// Begin our bluesky post
const postObject = {
  langs: ['en-AU', 'en'],
  createdAt: songDate.toISOString(),
};

const lines = [
  `${clockEmoji( config.timezone, song.started )} ${songDate.toLocaleTimeString( 'en-AU', timeOptions )}`,
  ``,
  `🎵 ${song.title}`,
  `🧑‍🎤 ${song.artist}`,  
];

if ( song.album !== song.title ) {
  lines.push( `💿 ${song.album}` );
}

// Search the music streaming services for our song
const streamingLinks = [];
console.log( '🔍 Searching streaming services...' );

const appleMusic = await searchAppleMusic( song );
appleMusic && streamingLinks.push({
  service: 'Apple Music',
  url: appleMusic,
}) && console.log( '✅ Found song on Apple Music' );

const spotify = await searchSpotify( song );
spotify && streamingLinks.push({
  service: 'Spotify',
  url: spotify,
}) && console.log( '✅ Found song on Spotify' );

const yt = await searchYouTube( song );
yt && streamingLinks.push({
  service: 'YouTube Music',
  url: yt,
}) && console.log( '✅ Found song on YouTube Music' );

// Add found streaming services to the post
streamingLinks.length && lines.push(
  ``,
  `🎧 ${streamingLinks.map( service => service.service ).join(' / ')}`
);


// Begin talking to Bluesky
console.log( 'Logging in to Bluesky' );
const agent = new BskyAgent({ service: "https://bsky.social" });
await agent.login({
  identifier: config.username,
  password: config.password,
});


// Put the post together
const rt = lines.join('\n');

// Add the link facets to the post
for ( const stream of streamingLinks ) {

  // Find the service name we added earlier
  const { start, end } = findByteRange( rt, stream.service );
  
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

postObject.text = rt;

if ( song.artwork ) {
  console.log( '' );

  console.log( '🖼️ Grabbing artwork' );
  const response = await fetch( song.artwork );
  const buffer = await response.arrayBuffer();

  console.log( '⬆️ Uploading artwork to Bluesky...' );
  const { data } = await agent.uploadBlob( new Uint8Array( buffer ), { encoding: 'image/jpeg' } );
  console.log( '✅ Uploaded!' );

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
  console.log( '' );
}

console.log( '🚀 Posting to Bluesky', postObject );
await agent.post( postObject );
console.log( '✅ Done!' );

process.exit(0);