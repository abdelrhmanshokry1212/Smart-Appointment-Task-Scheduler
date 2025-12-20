import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as bodyParser from 'body-parser';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(bodyParser.json(), bodyParser.urlencoded({ extended: true }))
      .forRoutes('*');
  }
}
