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
import { ShowSeatsService } from './show-seats.service';
import { CreateShowSeatDto } from './dto/create-show-seat.dto';
import { UpdateShowSeatDto } from './dto/update-show-seat.dto';
import { Role, ShowSeat } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('show-seats')
export class ShowSeatsController {
  constructor(private readonly showSeatsService: ShowSeatsService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Post()
  async create(@Body() createShowSeatDto: CreateShowSeatDto) {
    const { showId, seatId, price, status } = createShowSeatDto;
    return this.showSeatsService.create({
      show: {
        connect: { show_id: Number(showId) },
      },
      seat: {
        connect: { seat_id: Number(seatId) },
      },
      price,
      status,
    });
  }

  @Get()
  async findAll(): Promise<ShowSeat[]> {
    return this.showSeatsService.findAll();
  }

  @Get('show-seatsbyshowid/:showId')
  async findManyByShowId(@Param('showId') showId: string): Promise<ShowSeat[]> {
    return this.showSeatsService.showSeats({
      where: {
        showId: Number(showId),
      },
    });
  }

  @Get('show-seatsbyseatid/:seatId')
  async findManyBySeatId(@Param('seatId') seatId: string): Promise<ShowSeat[]> {
    return this.showSeatsService.showSeats({
      where: {
        seatId: Number(seatId),
      },
    });
  }

  @Get('show-seat/:id')
  async findOne(@Param('id') id: string): Promise<ShowSeat | null> {
    return this.showSeatsService.showSeat({ show_seat_id: Number(id) });
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Patch('show-seat/:id')
  async update(
    @Param('id') id: string,
    @Body() updateShowSeatDto: UpdateShowSeatDto,
  ): Promise<ShowSeat> {
    const { showId, seatId, price, status } = updateShowSeatDto;
    return this.showSeatsService.update({
      where: { show_seat_id: Number(id) },
      data: {
        show: {
          connect: { show_id: Number(showId) },
        },
        seat: {
          connect: { seat_id: Number(seatId) },
        },
        price,
        status,
      },
    });
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Delete('show-seat/:id')
  async delete(@Param('id') id: string): Promise<ShowSeat | null> {
    return this.showSeatsService.delete({ show_seat_id: Number(id) });
  }
}
