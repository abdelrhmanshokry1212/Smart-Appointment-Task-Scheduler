import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }]),
        HttpModule
    ],
    controllers: [AppointmentsController],
    providers: [AppointmentsService],
})
export class AppointmentsModule { }
