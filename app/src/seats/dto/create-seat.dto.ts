import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSeatDto {
  @IsNumber()
  @IsNotEmpty()
  screenId: number;

  @IsString()
  @IsNotEmpty()
  row: string;

  @IsNumber()
  @IsNotEmpty()
  seat_number: number;
}
