import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification, Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CINEMA)
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

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('notificationsbyuserid/:userId')
  async findManybyUserId(
    @Param('userId') userId: string,
  ): Promise<Notification[]> {
    return this.notificationsService.notifications({
      where: {
        userId: Number(userId),
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('notification/:id')
  async findOne(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.notification({
      notification_id: Number(id),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CINEMA)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CINEMA)
  @Delete('notification/:id')
  async delete(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.delete({ notification_id: Number(id) });
  }
}
