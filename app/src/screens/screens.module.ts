import { Module } from '@nestjs/common';
import { ScreensService } from './screens.service';
import { ScreensController } from './screens.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ScreensController],
  providers: [ScreensService, JwtService],
})
export class ScreensModule {}
