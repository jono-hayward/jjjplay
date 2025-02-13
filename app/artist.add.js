import "dotenv/config";

import { createClient } from 'redis';

import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const rl = readline.createInterface({ input, output });

const artist = await rl.question('Artist name: ');
const entity = await rl.question('ABC artist entity ID: ');
const did    = await rl.question('Bluesky profile DID: ');
rl.close();

if (artist && entity && did) {
    const redis =  await createClient({ url: process.env.REDIS_URL }).connect();
    const send = await redis.hSet(`artist:${entity}`, {
        artist,
        did
    });
    console.log('Send result', send);
    await redis.quit();
    process.exit(0);
}
