import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService, JwtService],
})
export class MoviesModule {}
