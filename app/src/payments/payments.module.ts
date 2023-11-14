import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, JwtService],
})
export class PaymentsModule {}
