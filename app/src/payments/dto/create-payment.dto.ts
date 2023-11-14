import { PaymentStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus | null;

  @IsNumber()
  @IsNotEmpty()
  bookingId: number;
}
