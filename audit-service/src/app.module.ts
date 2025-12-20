
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://abraamrefaat_db_user:GaBoxkyGfVKkoiXl@cluster0.essgjzm.mongodb.net/audit-service?appName=Cluster0'),
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
