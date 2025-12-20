import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('analytics')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('user/:userId/productivity')
  async getProductivity(@Param('userId') userId: string) {
    return this.appService.getProductivity(userId);
  }
}
