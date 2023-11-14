import { Module } from '@nestjs/common';
import { ShowSeatsService } from './show-seats.service';
import { ShowSeatsController } from './show-seats.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ShowSeatsController],
  providers: [ShowSeatsService, JwtService],
})
export class ShowSeatsModule {}
