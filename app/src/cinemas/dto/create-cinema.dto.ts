import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCinemaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  city_id: number;

  @IsString()
  email: string | null;

  @IsString()
  phone_number: string | null;
}
