import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from '@prisma/client';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto): Promise<Booking> {
    const { userId, status } = createBookingDto;
    return this.bookingsService.create({
      user: {
        connect: { user_id: Number(userId) },
      },
      status,
    });
  }

  @Get()
  async findAll(): Promise<Booking[]> {
    return this.bookingsService.findAll();
  }

  @Get('booking/:id')
  async findOne(@Param('id') id: string): Promise<Booking> {
    return this.bookingsService.booking({ booking_id: Number(id) });
  }

  @Patch('booking/:id')
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    const { userId, status } = updateBookingDto;
    return this.bookingsService.update({
      where: { booking_id: Number(id) },
      data: {
        user: {
          connect: { user_id: Number(userId) },
        },
        status,
      },
    });
  }

  @Delete('booking/:id')
  async delete(@Param('id') id: string): Promise<Booking> {
    return this.bookingsService.delete({ booking_id: Number(id) });
  }
}
