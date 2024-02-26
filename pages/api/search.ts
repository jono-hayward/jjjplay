import type { NextApiRequest, NextApiResponse } from 'next';

import { searchAppleMusic } from "../../app/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const result = await searchAppleMusic( {
    title: 'Pretend (A$AP Rocky)',
    artist: 'Tinashe',
  } );

  res.status(200).json( result );
}