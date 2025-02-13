import "dotenv/config";

import { createClient } from 'redis';

const redis =  await createClient({ url: process.env.REDIS_URL }).connect();
const keys = await redis.keys('artist:*');

console.log(keys);

await redis.quit();
process.exit(0);