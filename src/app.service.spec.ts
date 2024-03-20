import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { AppRepositoryTag } from './app.repository';
import { AppRepositoryHashmap } from './app.repository.hashmap';
import { mergeMap, tap } from 'rxjs';
import { describe, beforeEach, it } from 'node:test';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: AppRepositoryTag, useClass: AppRepositoryHashmap },
        AppService,
      ],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  describe('retrieve', () => {
    it('should retrieve the saved URL', (done) => {
      const url = 'docker.com';
      appService
        .shorten(url)
        .pipe(mergeMap((hash) => appService.retrieve(hash)))
        .pipe(tap((retrieved) => expect(retrieved).toEqual(url)))
        .subscribe({
          next: (_value) => {}, // handle next values here
          error: (error) => {}, // handle errors here
          complete: () => done(),
        });
    });
  });
});
