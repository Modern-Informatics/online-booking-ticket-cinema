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
import { SeatsService } from './seats.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { Role, Seat } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CINEMA)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CINEMA)
  @Post('many')
  async createMany(@Body() seats: CreateSeatDto) {
    return this.seatsService.createMany(seats);
  }

  @Get()
  async findAll() {
    return this.seatsService.findAll();
  }

  @Get('seatsbyscreenid/:screenId')
  async findManyByScreenId(
    @Param('screenId') screenId: string,
  ): Promise<Seat[]> {
    return this.seatsService.seats({
      where: {
        screenId: Number(screenId),
      },
    });
  }

  @Get('seat/:id')
  async findOne(@Param('id') id: string): Promise<Seat> {
    return this.seatsService.seat({ seat_id: Number(id) });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CINEMA)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CINEMA)
  @Delete('seat/:id')
  async delete(@Param('id') id: string): Promise<Seat> {
    return this.seatsService.delete({ seat_id: Number(id) });
  }
}
