import { Module } from '@nestjs/common';
import { MoviesService } from './MoviesService';
import { MoviesController } from './movies.controller';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
