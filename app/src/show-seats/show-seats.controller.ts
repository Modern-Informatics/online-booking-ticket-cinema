import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShowSeatsService } from './show-seats.service';
import { CreateShowSeatDto } from './dto/create-show-seat.dto';
import { UpdateShowSeatDto } from './dto/update-show-seat.dto';
import { ShowSeat } from '@prisma/client';

@Controller('show-seats')
export class ShowSeatsController {
  constructor(private readonly showSeatsService: ShowSeatsService) {}

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

  @Get('show-seat/:id')
  async findOne(@Param('id') id: string): Promise<ShowSeat | null> {
    return this.showSeatsService.showSeat({ show_seat_id: Number(id) });
  }

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

  @Delete('show-seat/:id')
  async delete(@Param('id') id: string): Promise<ShowSeat | null> {
    return this.showSeatsService.delete({ show_seat_id: Number(id) });
  }
}
