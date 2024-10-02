import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { IORedisKey } from '../common/constants';
@Injectable()
export class RedisService {
  constructor(
    @Inject(IORedisKey)
    private readonly redisClient: Redis,
  ) {}

  async getKeys(pattern?: string): Promise<string[]> {
    return await this.redisClient.keys(pattern);
  }

  async insert(
    key: string,
    value: string | number,
    ex?: number,
  ): Promise<void> {
    if (!ex) {
      this.redisClient.set(key, value);
    } else {
      this.redisClient.set(key, value, 'EX', ex);
    }
  }
  exprie(key: string, ex: number): void {
    this.redisClient.expire(key, ex);
  }
  async til(key: string): Promise<number> {
    return await this.redisClient.ttl(key);
  }
  async get(key: string): Promise<string> {
    return this.redisClient.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async validate(key: string, value: string): Promise<boolean> {
    const storedValue = await this.redisClient.get(key);
    return storedValue === value;
  }
}
