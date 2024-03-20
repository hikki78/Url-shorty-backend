import { Observable, from } from 'rxjs';
import { RedisService } from 'nestjs-redis';

export interface AppRepository {
  put(hash: string, url: string): Observable<string>;
  get(hash: string): Observable<string>;
  getAll(): Promise<string[]>;
  delete(hash: string): Promise<void>;
  incrementClicks(hash: string): Promise<void>;
  getClicks(hash: string): Promise<{ count: number; times: Date[] }>;
}

export const AppRepositoryTag = 'AppRepository';

export class AppRepositoryImpl implements AppRepository {
  constructor(private readonly redisService: RedisService) {}

  put(hash: string, url: string): Observable<string> {
    const client = this.redisService.getClient();
    return from(client.set(hash, url));
  }

  get(hash: string): Observable<string> {
    const client = this.redisService.getClient();
    return from(client.get(hash));
  }

  async getAll(): Promise<string[]> {
    const client = this.redisService.getClient();
    const keys = await client.keys('*');
    const urls = await Promise.all(keys.map((key) => client.get(key)));
    return urls;
  }

  async delete(hash: string): Promise<void> {
    const client = this.redisService.getClient();
    await client.del(hash);
  }

  async incrementClicks(hash: string): Promise<void> {
    const client = this.redisService.getClient();
    const timestamp = Date.now();
    await client.zadd(
      `analytics:${hash}:times`,
      timestamp,
      timestamp.toString(),
    );
    await client.hincrby(`analytics:${hash}`, 'count', 1);
  }

  async getClicks(hash: string): Promise<{ count: number; times: Date[] }> {
    const client = this.redisService.getClient();
    const count = await client.hget(`analytics:${hash}`, 'count');
    const times = await client.zrange(`analytics:${hash}:times`, 0, -1);
    return {
      count: parseInt(count, 10),
      times: times.map((time) => new Date(parseInt(time, 10))),
    };
  }
}
