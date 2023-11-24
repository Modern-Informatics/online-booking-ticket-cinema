import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateShowDto {
  @IsNumber()
  @IsNotEmpty()
  movieId: number;

  @IsNumber()
  @IsNotEmpty()
  screenId: number;

  @IsDate()
  startAt: Date;

  @IsDate()
  endAt: Date;
}
