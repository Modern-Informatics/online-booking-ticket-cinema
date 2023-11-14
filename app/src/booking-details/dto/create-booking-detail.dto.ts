import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookingDetailDto {
  @IsNumber()
  @IsNotEmpty()
  bookingId: number;

  @IsNumber()
  @IsNotEmpty()
  showSeatId: number;
}
