import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from '@prisma/client';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { amount, paymentStatus, bookingId } = createPaymentDto;
    return this.paymentsService.create({
      amount,
      paymentStatus,
      booking: {
        connect: { booking_id: Number(bookingId) },
      },
    });
  }

  @Get()
  async findAll(): Promise<Payment[]> {
    return this.paymentsService.findAll();
  }

  @Get('payment/:id')
  async findOne(@Param('id') id: string): Promise<Payment> {
    return this.paymentsService.payment({ payment_id: Number(id) });
  }

  @Patch('payment/:id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const { amount, paymentStatus, bookingId } = updatePaymentDto;
    return this.paymentsService.update({
      where: { payment_id: Number(id) },
      data: {
        amount,
        paymentStatus,
        booking: {
          connect: { booking_id: Number(bookingId) },
        },
      },
    });
  }

  @Delete('payment/:id')
  async delete(@Param('id') id: string): Promise<Payment> {
    return this.paymentsService.delete({ payment_id: Number(id) });
  }
}
