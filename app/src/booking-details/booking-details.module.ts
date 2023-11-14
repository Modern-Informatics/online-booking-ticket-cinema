import { Module } from '@nestjs/common';
import { BookingDetailsService } from './booking-details.service';
import { BookingDetailsController } from './BookingDetailsController';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [BookingDetailsController],
  providers: [BookingDetailsService, JwtService],
})
export class BookingDetailsModule {}
