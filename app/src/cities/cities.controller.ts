import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { City, Role } from '@prisma/client';
import { UpdateCityDto } from './dto/update-city.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Post()
  async create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Get()
  async findAll(): Promise<City[]> {
    return this.citiesService.findAll();
  }

  @Get('city/:id')
  async findOne(@Param('id') id: string): Promise<City> {
    return this.citiesService.city({ city_id: Number(id) });
  }

  @Get('cities')
  async findByName(@Query('name') name: string): Promise<City[]> {
    return this.citiesService.cities({
      where: {
        name: {
          contains: name,
        },
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Patch('city/:id')
  async update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.citiesService.update({
      where: { city_id: Number(id) },
      data: updateCityDto,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Delete('city/:id')
  async remove(@Param('id') id: string): Promise<City> {
    return this.citiesService.delete({ city_id: Number(id) });
  }
}
