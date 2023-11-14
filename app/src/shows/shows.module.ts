import { Module } from '@nestjs/common';
import { ShowsService } from './shows.service';
import { ShowsController } from './shows.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ShowsController],
  providers: [ShowsService, JwtService],
})
export class ShowsModule {}
