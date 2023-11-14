import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SeatsController],
  providers: [SeatsService, JwtService],
})
export class SeatsModule {}
