import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  director: string;

  @IsString()
  @IsNotEmpty()
  main_actors: string;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsString()
  url_image: string;

  @IsString()
  description: string;
}
