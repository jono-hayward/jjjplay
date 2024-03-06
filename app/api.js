import 'dotenv/config';

import pkg from '@atproto/api';
const { BskyAgent } = pkg;

const config = {
  bsky_handle:   process.env.BSKY_HANDLE,
  bsky_username: process.env.BSKY_USERNAME,
  bsky_password: process.env.BSKY_PASSWORD,
};

// Begin talking to Bluesky
console.log( '🪵 Logging in to Bluesky' );
const agent = new BskyAgent({ service: "https://bsky.social" });
await agent.login({
  identifier: config.bsky_username,
  password: config.bsky_password,
});

console.log( '✅ Done' );

console.log( '🔍 Getting feed...' );

// Get latest post date
const feed = await agent.getAuthorFeed({
  actor: config.bsky_handle,
  limit: 10,
});

console.log( feed.data.feed[0].post.record.text );