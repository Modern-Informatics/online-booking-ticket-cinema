import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CinemasService } from './cinemas.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { Cinema } from '@prisma/client';

@Controller('cinemas')
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {}

  @Post()
  async create(@Body() createCinemaDto: CreateCinemaDto): Promise<Cinema> {
    const { name, city_id, email, phone_number } = createCinemaDto;
    return this.cinemasService.create({
      name,
      city: {
        connect: { city_id },
      },
      email,
      phone_number,
    });
  }

  @Get()
  async findAll(): Promise<Cinema[]> {
    return this.cinemasService.findAll();
  }

  @Get('cinema/:id')
  async findOne(@Param('id') id: string): Promise<Cinema> {
    return this.cinemasService.cinema({ cinema_id: Number(id) });
  }

  @Patch('cinema/:id')
  async update(
    @Param('id') id: string,
    @Body() updateCinemaDto: UpdateCinemaDto,
  ) {
    return this.cinemasService.update({
      where: { cinema_id: Number(id) },
      data: updateCinemaDto,
    });
  }

  @Delete('cinema/:id')
  async remove(@Param('id') id: string): Promise<Cinema> {
    return this.cinemasService.delete({ cinema_id: Number(id) });
  }
}
