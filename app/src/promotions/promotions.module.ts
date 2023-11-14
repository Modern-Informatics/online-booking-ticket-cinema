import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PromotionsController],
  providers: [PromotionsService, JwtService],
})
export class PromotionsModule {}
