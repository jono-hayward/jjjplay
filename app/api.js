import 'dotenv/config';

import pkg from '@atproto/api';
const { BskyAgent } = pkg;

const config = {
  bsky_handle:   process.env.BSKY_HANDLE,
  bsky_username: process.env.BSKY_USERNAME,
  bsky_password: process.env.BSKY_PASSWORD,
  timezone: process.env.TIMEZONE,
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
  limit: 1,
});

if ( feed && feed.data ) {
  latest = new Date( feed.data.cursor );
} else {
  const now = new Date();
  now.setMinutes(now.getMinutes() - 10);
  latest = now;
}
console.log( `⌚️ Latest post was at ${latest.toLocaleTimeString( 'en-AU', timeOptions )}` );

const stamp = latest.toISOString().replace('Z', '+00:00:00');
const API = `https://music.abcradio.net.au/api/v1/plays/search.json?station=${station}&order=desc&tz=${config.timezone}&from=${encodeURIComponent(stamp)}`;
console.log( 'Querying', API );

const scrape = async () => fetch(API).then( response => response.json() );
const tracks = await scrape();

console.log( tracks );
for ( const song of tracks.items ) {
  console.log( song );
}