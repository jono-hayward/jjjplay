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
  bsky_handle:    process.env.BSKY_HANDLE,
  bsky_username:  process.env.BSKY_USERNAME,
  bsky_password:  process.env.BSKY_PASSWORD,
  station:        process.env.STATION,
  timezone:       process.env.TIMEZONE,
};

const timeOptions = {
  timeStyle: 'short',
  timeZone: config.timezone,
};

// Begin talking to Bluesky
console.log( '🪵 Logging in to Bluesky' );
const agent = new BskyAgent({ service: "https://bsky.social" });
await agent.login({
  identifier: config.bsky_username,
  password: config.bsky_password,
});

// Get latest post date
console.log( '🔍 Finding the time of the most recent post' );
let latest;
const feed = await agent.getAuthorFeed({
  actor: config.bsky_handle,
  limit: 10,
});

if ( feed && feed.data ) {
  // Filter out posts that begin with 🤖, which we're using for service updates
  const posts = feed.data.feed.filter( entry => !entry.post.record.text.startsWith( '🤖' ) );
  latest = new Date( posts[0].post.record.createdAt );

  /* Doing the API query based on the exact time of the post seems to result in a possible duplicate
   * Just offsetting by a few seconds should get around that */
  latest.setSeconds( latest.getSeconds() + 10 );
} else {
  const now = new Date();
  now.setMinutes(now.getMinutes() - 10);
  latest = now;
}
console.log( `⌚️ Latest post was at ${latest.toLocaleTimeString( 'en-AU', timeOptions )}` );

const params = new URLSearchParams( {
  station: config.station,
  order: 'desc', // We want them in descending order to always get the latest, even if for some reason there's more results than our limit
  tz: config.timezone,
  from: latest.toISOString().replace('Z', '+00:00:00'), // Turn the ISO string into something the ABC API will accept
  limit: 10,
} );

const API = `https://music.abcradio.net.au/api/v1/plays/search.json?${params.toString()}`;

const scrape = async () => fetch(API).then( response => response.json() );
const tracks = await scrape();

if ( !tracks.total ) {
  console.log( '⛔ No new plays since last post.' );
  process.exit(0);
}

/**
 * Sort the items into ascending order, so we post from oldest to most recent.
 * Technically since we're setting the createdAt attribute to the played time anyway,
 * this shouldn't matter. But it feels neater to do it this way?
 */
tracks.items.sort((a, b) => new Date(a.played_time) - new Date(b.played_time));

/** Iterate through tracks */
for ( const track of tracks.items ) {

  const song = parse( track );

  if ( song ) {

    const songDate = new Date( song.started );
  
    console.log( ' ' );
    console.log( `🎵 Processing "${song.title}" by ${song.artist}, played at ${songDate.toLocaleTimeString( 'en-AU', timeOptions )}` );
  
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
      
      console.log( ' ' );
      console.log( '🖼️ Processing artwork' );
      
      try {
        const response = await fetch( song.artwork );
        const buffer = await response.arrayBuffer();

        // An API error stated the maximum file size as 976.56kb
        if ( buffer.byteLength < 976560 ) {
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
        }        
      } catch ( err ) {
        console.error( '❌ Image processing failed. Skipping...' );
        console.error( 'Error:', err );
      }
    }
    
    console.log( ' ' );
    console.log( '🚀 Posting to Bluesky', postObject );
    try {
      await agent.post( postObject );
      console.log( '✅ Done!' );
    } catch (err) {
      console.error( '⛔ Failed to post to Bluesky', err );
    }
  }

}

process.exit(0);
