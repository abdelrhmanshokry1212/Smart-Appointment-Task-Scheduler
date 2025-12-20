
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from './schemas/appointment.schema';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';

import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
        private readonly httpService: HttpService
    ) { }

    async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
        const createdAppointment = new this.appointmentModel(createAppointmentDto);
        const savedAppointment = await createdAppointment.save();

        try {
            await firstValueFrom(
                this.httpService.post('http://127.0.0.1:3003/notifications', {
                    userId: savedAppointment.userId,
                    title: 'New Appointment',
                    text: `You have scheduled "${savedAppointment.title}" on ${savedAppointment.date} at ${savedAppointment.time}.`,
                    time: new Date().toLocaleTimeString(),
                    read: false
                })
            );
        } catch (error) {
            console.error('Failed to send notification:', error.message);
        }

        return savedAppointment;
    }


    async findAllByUserId(userId: string): Promise<Appointment[]> {
        return this.appointmentModel.find({ userId }).exec();
    }

    async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
        const existingAppointment = await this.appointmentModel.findByIdAndUpdate(id, updateAppointmentDto, { new: true });
        if (!existingAppointment) {
            throw new NotFoundException(`Appointment #${id} not found`);
        }
        return existingAppointment;
    }

    async remove(id: string): Promise<Appointment> {
        const deletedAppointment = await this.appointmentModel.findByIdAndDelete(id);
        if (!deletedAppointment) {
            throw new NotFoundException(`Appointment #${id} not found`);
        }
        return deletedAppointment;
    }
}
