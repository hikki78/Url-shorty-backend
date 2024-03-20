import { Body, Controller, Get, Param, Post, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { map, Observable, of } from 'rxjs';
import { Delete } from '@nestjs/common';

interface ShortenResponse {
  hash: string;
}

interface ErrorResponse {
  error: string;
  code: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/all')
  async getAll(): Promise<string[]> {
    return this.appService.getAll();
  }

  @Post('shorten')
  shorten(
    @Body('url') url: string,
  ): Observable<ShortenResponse | ErrorResponse> {
    if (!url) {
      return of({
        error: `No url provided. Please provide in the body. E.g. {'url':'https://google.com'}`,
        code: 400,
      });
    }
    return this.appService.shorten(url).pipe(map((hash) => ({ hash })));
  }

  @Delete('delete/:hash')
  async delete(@Param('hash') hash: string): Promise<void> {
    return this.appService.delete(hash);
  }

  @Get('analytics/:hash')
  async getAnalytics(@Param('hash') hash: string): Promise<{ count: number, times: Date[] }> {
    return this.appService.getClicks(hash);
  }

  @Get(':hash')
  @Redirect()
  retrieveAndRedirect(@Param('hash') hash): Observable<{ url: string }> {
    this.appService.incrementClicks(hash);
    return this.appService.retrieve(hash).pipe(map((url) => ({ url })));
  }
}
