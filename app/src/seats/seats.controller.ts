import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SeatsService } from './seats.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { Seat } from '@prisma/client';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Post()
  async create(@Body() createSeatDto: CreateSeatDto): Promise<Seat> {
    const { screenId, row, seat_number } = createSeatDto;
    return this.seatsService.create({
      screen: {
        connect: { screen_id: Number(screenId) },
      },
      row,
      seat_number,
    });
  }

  @Get()
  async findAll() {
    return this.seatsService.findAll();
  }

  @Get('seat/:id')
  async findOne(@Param('id') id: string): Promise<Seat> {
    return this.seatsService.seat({ seat_id: Number(id) });
  }

  @Patch('seat/:id')
  async update(
    @Param('id') id: string,
    @Body() updateSeatDto: UpdateSeatDto,
  ): Promise<Seat> {
    const { screenId, row, seat_number } = updateSeatDto;
    return this.seatsService.update({
      where: { seat_id: Number(id) },
      data: {
        screen: {
          connect: { screen_id: Number(screenId) },
        },
        row,
        seat_number,
      },
    });
  }

  @Delete('seat/:id')
  async delete(@Param('id') id: string): Promise<Seat> {
    return this.seatsService.delete({ seat_id: Number(id) });
  }
}
