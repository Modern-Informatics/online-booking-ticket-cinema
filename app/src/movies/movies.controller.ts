import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MoviesService } from './MoviesService';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from '@prisma/client';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  async findAll(): Promise<Movie[]> {
    return this.moviesService.findAll();
  }

  @Get('movie/:id')
  async findOne(@Param('id') id: string) {
    return this.moviesService.movie({ movie_id: Number(id) });
  }

  @Patch('movie/:id')
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update({
      where: { movie_id: Number(id) },
      data: updateMovieDto,
    });
  }

  @Delete('movie/:id')
  async remove(@Param('id') id: string) {
    return this.moviesService.delete({ movie_id: Number(id) });
  }
}
