import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './modules/auth/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /** Public: Railway's health check (railway.toml) calls it. */
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
