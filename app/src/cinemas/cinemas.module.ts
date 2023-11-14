import { Module } from '@nestjs/common';
import { CinemasService } from './cinemas.service';
import { CinemasController } from './cinemas.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CinemasController],
  providers: [CinemasService, JwtService],
})
export class CinemasModule {}
