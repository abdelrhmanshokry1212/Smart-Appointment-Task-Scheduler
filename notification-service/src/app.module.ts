
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://abraamrefaat_db_user:GaBoxkyGfVKkoiXl@cluster0.essgjzm.mongodb.net/notification-service?appName=Cluster0'),
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
