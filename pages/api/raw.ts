import type { NextApiRequest, NextApiResponse } from 'next';

import { parse } from "../../app/helpers";

const config = {
  timezone: process.env.timezone,
};

const timeOptions = {
  timeStyle: 'short',
  timeZone: config.timezone,
};

const API = `https://music.abcradio.net.au/api/v1/plays/triplej/now.json?tz=${config.timezone}`;
const scrape = async () => fetch( API ).then( response => response.json() );

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const playing = await scrape();

  res.status(200).json({
    now_playing: playing,
    parsed: parse( playing ),
  });
}