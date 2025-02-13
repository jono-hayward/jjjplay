import "dotenv/config";

import { createClient } from 'redis';

import { all_artists } from './lookup.js';

const redis =  await createClient({ url: process.env.REDIS_URL }).connect();

const all = all_artists();
for (const key in all) {
    const val = all[key];
    if (val) {
        console.log('Setting', key, val);
        const del = await redis.del(key);
        console.log(del);
        const send = await redis.hSet(`artist:${key}`, all[key]);
        console.log(send);
    }
}

process.exit(0);