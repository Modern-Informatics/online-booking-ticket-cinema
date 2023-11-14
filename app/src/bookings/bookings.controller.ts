import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll(): Promise<Booking[]> {
    return this.bookingsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('booking/:id')
  async findOne(@Param('id') id: string): Promise<Booking> {
    return this.bookingsService.booking({ booking_id: Number(id) });
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Delete('booking/:id')
  async delete(@Param('id') id: string): Promise<Booking> {
    return this.bookingsService.delete({ booking_id: Number(id) });
  }
}
