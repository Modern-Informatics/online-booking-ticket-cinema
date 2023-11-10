import { BookingStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsEnum(BookingStatus)
  status?: BookingStatus | null;
}
