import { Inject, Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AppRepository, AppRepositoryTag } from './app.repository';

@Injectable()
export class AppService {
  constructor(
    @Inject(AppRepositoryTag) private readonly appRepository: AppRepository,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getAll(): Promise<string[]> {
    return this.appRepository.getAll();
  }

  shorten(url: string): Observable<string> {
    const hash = Math.random().toString(36).slice(7);
    return this.appRepository.put(hash, url).pipe(map(() => hash));
  }

  retrieve(hash: string): Observable<string> {
    return this.appRepository.get(hash);
  }

  async delete(hash: string): Promise<void> {
    return this.appRepository.delete(hash);
  }

  async incrementClicks(hash: string): Promise<void> {
    await this.appRepository.incrementClicks(hash);
  }

  async getClicks(hash: string): Promise<{ count: number; times: string[] }> {
    const data = await this.appRepository.getClicks(hash);
    const timesIST = data.times.map((time) =>
      new Date(time).toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
      }),
    );
    return {
      count: data.count,
      times: timesIST,
    };
  }
}
