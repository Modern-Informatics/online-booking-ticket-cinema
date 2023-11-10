import { Module } from '@nestjs/common';
import { ShowSeatsService } from './show-seats.service';
import { ShowSeatsController } from './show-seats.controller';

@Module({
  controllers: [ShowSeatsController],
  providers: [ShowSeatsService],
})
export class ShowSeatsModule {}
