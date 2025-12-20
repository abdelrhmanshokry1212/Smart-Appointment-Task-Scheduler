
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post()
    create(@Body() createAppointmentDto: CreateAppointmentDto) {
        return this.appointmentsService.create(createAppointmentDto);
    }

    @Get('user/:userId')
    findAllByUserId(@Param('userId') userId: string) {
        return this.appointmentsService.findAllByUserId(userId);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
        return this.appointmentsService.update(id, updateAppointmentDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.appointmentsService.remove(id);
    }
}
