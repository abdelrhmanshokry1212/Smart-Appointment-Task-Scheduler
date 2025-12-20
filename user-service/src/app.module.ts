
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://abraamrefaat_db_user:GaBoxkyGfVKkoiXl@cluster0.essgjzm.mongodb.net/user-service?appName=Cluster0'),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
