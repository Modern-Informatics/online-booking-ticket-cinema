import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, JwtService],
})
export class NotificationsModule {}
