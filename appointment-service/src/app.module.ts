
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://abraamrefaat_db_user:GaBoxkyGfVKkoiXl@cluster0.essgjzm.mongodb.net/appointment-service?appName=Cluster0'),
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
