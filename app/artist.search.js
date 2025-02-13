import "dotenv/config";

import { createClient } from 'redis';

import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const rl = readline.createInterface({ input, output });

const entity = await rl.question('ABC artist entity ID: ');
rl.close();

if (entity) {
    const redis =  await createClient({ url: process.env.REDIS_URL }).connect();
    const get = await redis.hGetAll(`artist:${entity}`);
    if (Object.keys(get).length) {
        console.log('Results for', entity);
        console.log(Object.assign({},get));
    } else {
        console.log('No results');
    }
    await redis.quit();
}

process.exit(0);
