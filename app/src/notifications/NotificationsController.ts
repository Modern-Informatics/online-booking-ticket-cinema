import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from '@prisma/client';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const { message, userId } = createNotificationDto;
    return this.notificationsService.create({
      message,
      user: {
        connect: { user_id: Number(userId) },
      },
    });
  }

  @Get()
  async findAll(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  @Get('notification/:id')
  async findOne(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.notification({
      notification_id: Number(id),
    });
  }

  @Patch('notification/:id')
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const { message, userId } = updateNotificationDto;
    return this.notificationsService.update({
      where: { notification_id: Number(id) },
      data: {
        message,
        user: {
          connect: { user_id: Number(userId) },
        },
      },
    });
  }

  @Delete('notification/:id')
  async delete(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.delete({ notification_id: Number(id) });
  }
}
