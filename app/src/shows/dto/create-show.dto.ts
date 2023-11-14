import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateShowDto {
  @IsNumber()
  @IsNotEmpty()
  movieId: number;

  @IsNumber()
  @IsNotEmpty()
  screenId: number;
}
