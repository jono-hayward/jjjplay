import "dotenv/config";
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

import { createClient } from 'redis';

const redis =  await createClient({ url: process.env.REDIS_URL }).connect();

const rl = readline.createInterface({ input, output });

const entity = await rl.question('ABC artist entity ID: ');

const del = await redis.del(entity);


await redis.quit();
process.exit(0);