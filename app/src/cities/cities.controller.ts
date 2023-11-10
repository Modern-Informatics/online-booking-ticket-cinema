import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { City } from '@prisma/client';
import { UpdateCityDto } from './dto/update-city.dto';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

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

  @Patch('city/:id')
  async update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.citiesService.update({
      where: { city_id: Number(id) },
      data: updateCityDto,
    });
  }

  @Delete('city/:id')
  async remove(@Param('id') id: string): Promise<City> {
    return this.citiesService.delete({ city_id: Number(id) });
  }
}
