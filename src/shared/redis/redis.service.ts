import { createClient } from 'redis';

import { config } from '../../config/configuration';

const redisClient = createClient({
  url: config.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export async function initRedis() {
  await redisClient.connect();
}

export default redisClient;