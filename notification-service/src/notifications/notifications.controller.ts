
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/notification.dto';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Post()
    create(@Body() createNotificationDto: CreateNotificationDto) {
        return this.notificationsService.create(createNotificationDto);
    }

    @Get('user/:userId')
    findAllByUserId(@Param('userId') userId: string) {
        return this.notificationsService.findAllByUserId(userId);
    }
}
