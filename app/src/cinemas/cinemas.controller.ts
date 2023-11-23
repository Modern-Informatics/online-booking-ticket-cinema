import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CinemasService } from './cinemas.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { Cinema, Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('cinemas')
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CINEMA)
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

  @Get('cinemasbycityid/:cityId')
  async findManyByCityId(@Param('cityId') cityId: string): Promise<Cinema[]> {
    return this.cinemasService.cinemas({
      where: {
        cityId: Number(cityId),
      },
    });
  }

  @Get('cinemas')
  async findByName(@Query('name') name: string): Promise<Cinema[]> {
    return this.cinemasService.cinemas({
      where: {
        name: {
          contains: name,
        },
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CINEMA)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CINEMA)
  @UseGuards(JwtAuthGuard)
  @Delete('cinema/:id')
  async remove(@Param('id') id: string): Promise<Cinema> {
    return this.cinemasService.delete({ cinema_id: Number(id) });
  }
}
