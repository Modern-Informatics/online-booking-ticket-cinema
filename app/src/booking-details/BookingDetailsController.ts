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
import { BookingDetailsService } from './booking-details.service';
import { CreateBookingDetailDto } from './dto/create-booking-detail.dto';
import { UpdateBookingDetailDto } from './dto/update-booking-detail.dto';
import { BookingDetail, Role } from '@prisma/client';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(JwtAuthGuard)
@Controller('booking-details')
export class BookingDetailsController {
  constructor(private readonly bookingDetailsService: BookingDetailsService) {}

  @Post()
  async create(
    @Body() createBookingDetailDto: CreateBookingDetailDto,
  ): Promise<BookingDetail> {
    const { bookingId, showSeatId } = createBookingDetailDto;
    return this.bookingDetailsService.create({
      booking: {
        connect: { booking_id: Number(bookingId) },
      },
      showSeat: {
        connect: { show_seat_id: Number(showSeatId) },
      },
    });
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.CINEMA)
  @Get()
  async findAll(): Promise<BookingDetail[]> {
    return this.bookingDetailsService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.CINEMA)
  @Get('booking-detailsbybookingid/:bookingId')
  async findManybyBookingId(
    @Param('bookingId') bookingId: string,
  ): Promise<BookingDetail[]> {
    return this.bookingDetailsService.bookingDetails({
      where: {
        bookingId: Number(bookingId),
      },
    });
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.CINEMA)
  @Get('booking-detailsbyshowseatid/:showSeatId')
  async findManyByShowSeatId(
    @Param('showSeatId') showSeatId: string,
  ): Promise<BookingDetail[]> {
    return this.bookingDetailsService.bookingDetails({
      where: {
        showSeatId: Number(showSeatId),
      },
    });
  }

  @Get('booking-detail/:id')
  async findOne(@Param('id') id: string): Promise<BookingDetail> {
    return this.bookingDetailsService.bookingDetail({
      booking_detail_id: Number(id),
    });
  }

  @Patch('booking-detail/:id')
  async update(
    @Param('id') id: string,
    @Body() updateBookingDetailDto: UpdateBookingDetailDto,
  ): Promise<BookingDetail> {
    const { bookingId, showSeatId } = updateBookingDetailDto;
    return this.bookingDetailsService.update({
      where: { booking_detail_id: Number(id) },
      data: {
        booking: {
          connect: { booking_id: Number(bookingId) },
        },
        showSeat: {
          connect: { show_seat_id: Number(showSeatId) },
        },
      },
    });
  }

  @Delete('booking-detail/:id')
  async remove(@Param('id') id: string) {
    return this.bookingDetailsService.delete({ booking_detail_id: Number(id) });
  }
}
