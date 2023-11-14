import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CitiesController],
  providers: [CitiesService, JwtService],
})
export class CitiesModule {}
