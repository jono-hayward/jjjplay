import { BskyAgent, RichText } from '@atproto/api';

import type { NextApiRequest, NextApiResponse } from 'next';

import { parse, searchAppleMusic, searchSpotify, searchYouTube } from '../../app/helpers';

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

const scrape = async () => fetch(API).then(response => response.json());


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  if ( req.headers instanceof Headers ) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).end('Unauthorized');
    }
  }

  const response:any = {};

  const playing = await scrape();

  if (playing.now && playing.now.recording) {

    const song = parse(playing.now);

    response.now_playing = song;

    const songDate = new Date(song.started);

    const postObject:any = {
      langs: ['en-AU', 'en'],
      createdAt: songDate.toISOString(),
    };

    const lines = [
      song.title,
      `by ${song.artist}`,
    ];

    if (song.album !== song.title) {
      lines.push(`from ${song.album}`);
    }
    // `${clockEmoji( config.timezone, song.started )} ${songDate.toLocaleTimeString( 'en-AU', timeOptions )}`,

    const streamingLinks = [];

    const appleMusic = await searchAppleMusic(song);
    appleMusic && streamingLinks.push({
      service: 'Apple Music',
      url: appleMusic,
    });

    const spotify = await searchSpotify(song);
    spotify && streamingLinks.push({
      service: 'Spotify',
      url: spotify,
    });

    const yt = await searchYouTube(song);
    yt && streamingLinks.push({
      service: 'YouTube Music',
      url: yt,
    });

    streamingLinks.length && lines.push(
      ``,
      `${streamingLinks.map(service => service.service).join(' / ')}`
    );

    const agent = new BskyAgent({ service: "https://bsky.social" });
    await agent.login({
      identifier: config.username!,
      password: config.password!,
    });

    const rt = new RichText({ text: lines.join('\n') });

    for (const stream of streamingLinks) {

      const serviceName = new RichText({ text: stream.service });

      const start = rt.text.search(serviceName.text);
      const end = start + serviceName.length;

      if (!postObject.facets) {
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

    if (song.artwork) {

      const response = await fetch(song.artwork);

      const buffer = await response.arrayBuffer();

      const { data } = await agent.uploadBlob(new Uint8Array(buffer), { encoding: 'image/jpeg' });

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

    await agent.post(postObject);

  } else {
    response.error = 'No song currently playing';
  }

  res.status(200).json( response )
}