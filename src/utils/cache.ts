import redisClient from "../shared/redis/redis.service";

export async function getCache<T>(key: string): Promise<T | null> {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
}

export async function setCache<T>(key: string, value: T, expiryInSeconds?: number): Promise<void> {
  if (expiryInSeconds !== undefined) {
    await redisClient.set(key, JSON.stringify(value), {
      EX: expiryInSeconds
    });
  } else {
    await redisClient.set(key, JSON.stringify(value));
  }
}