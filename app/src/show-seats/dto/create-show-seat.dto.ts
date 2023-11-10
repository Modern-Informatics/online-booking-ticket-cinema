import { ShowSeatStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateShowSeatDto {
  @IsNumber()
  @IsNotEmpty()
  showId: number;

  @IsNumber()
  @IsNotEmpty()
  seatId: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsEnum(ShowSeatStatus)
  status?: ShowSeatStatus | null;
}
