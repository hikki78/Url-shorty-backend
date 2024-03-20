/* eslint-disable @typescript-eslint/no-unused-vars */
import { AppRepository } from './app.repository';
import { Observable, from, mergeMap } from 'rxjs';
import { createClient, RedisClientType } from 'redis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppRepositoryRedis implements AppRepository {
  private readonly redisClient: RedisClientType;

  constructor() {
    const host = process.env.REDIS_HOST || 'redis';
    const port = +process.env.REDIS_PORT || 6379;
    this.redisClient = createClient({
      url: `redis://${host}:${port}`,
    });
    from(this.redisClient.connect()).subscribe({ error: console.error });
    this.redisClient.on('connect', () => console.log('Redis connected'));
    this.redisClient.on('error', console.error);
  }

  async getAll(): Promise<string[]> {
    const keys = await this.redisClient.keys('*');
    return keys;
  }

  get(hash: string): Observable<string> {
    return from(this.redisClient.get(hash));
  }

  put(hash: string, url: string): Observable<string> {
    return from(this.redisClient.set(hash, url)).pipe(
      mergeMap(() => from(this.redisClient.get(hash))),
    );
  }

  async delete(hash: string): Promise<void> {
    this.redisClient.del(hash);
  }

  async incrementClicks(hash: string): Promise<void> {
    const timestamp = Date.now();
    await this.redisClient.zAdd(
      `analytics:${hash}:times`,
      timestamp,
      timestamp.toString(),
    );
    await this.redisClient.hIncrBy(`analytics:${hash}`, 'count', 1);
  }

  async getClicks(hash: string): Promise<{ count: number; times: Date[] }> {
    const count = await this.redisClient.hGet(`analytics:${hash}`, 'count');
    const times = await this.redisClient.zRange(
      `analytics:${hash}:times`,
      0,
      -1,
    );
    return {
      count: parseInt(count, 10),
      times: times.map((time) => new Date(parseInt(time, 10))),
    };
  }
}
