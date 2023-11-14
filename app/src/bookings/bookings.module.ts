import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService, JwtService],
})
export class BookingsModule {}
