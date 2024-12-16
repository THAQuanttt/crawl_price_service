import redisClient from "../shared/redis/redis.service";
export interface ICacheService {
  getCache<T>(key: string): Promise<T | null>;
  setCache<T>(key: string, value: T, expiryInSeconds?: number): Promise<void>;
  getAllListTokens<T>(match: string): Promise<{ [key: string]: T }>;
}

class CacheService implements ICacheService {
  async getCache<T>(key: string): Promise<T | null> {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async setCache<T>(key: string, value: T, expiryInSeconds?: number): Promise<void> {
    if (expiryInSeconds !== undefined) {
      await redisClient.set(key, JSON.stringify(value), {
        EX: expiryInSeconds,
      });
    } else {
      await redisClient.set(key, JSON.stringify(value));
    }
  }
  async getAllListTokens<T>(match: string): Promise<{ [key: string]: T }> {
    let cursor = 0;
    const result: { [key: string]: T } = {};
  
    while (true) {
      // Use destructuring with the actual return type of your specific Redis client
      const scanResult = await redisClient.scan(cursor, {
        MATCH: match,
        COUNT: 100,
      });
  
      // Handle different possible return formats
      const keys = Array.isArray(scanResult) 
        ? scanResult[1]  // If it returns [cursor, keys]
        : scanResult.keys;  // If it returns an object with cursor and keys
  
      cursor = Array.isArray(scanResult) 
        ? Number(scanResult[0])  // If it returns [cursor, keys]
        : Number(scanResult.cursor);  // If it returns an object with cursor and keys
  
        for (const key of keys) {
          try {
            // First, check the type of the key
            const type = await redisClient.type(key);
            if (type === 'string') {
              const token = key.split(':')[2];
              const data = await redisClient.get(key);
              result[token] = data ? JSON.parse(data) : null;
            } else {
              console.warn(`Key ${key} is not a string (type: ${type}), skipping`);
            }
          } catch (error) {
            console.error(`Error processing key ${key}:`, error);
          }
        }
  
      if (cursor === 0) break;  // Stop when cursor returns to 0
    }
    return result;
  }
}

export const cacheService = new CacheService();