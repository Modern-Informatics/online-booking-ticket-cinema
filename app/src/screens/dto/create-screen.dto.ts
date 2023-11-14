import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateScreenDto {
  @IsNumber()
  @IsNotEmpty()
  cinema_id: number;
}
