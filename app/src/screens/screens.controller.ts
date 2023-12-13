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
import { ScreensService } from './screens.service';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { Role, Screen } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('screens')
export class ScreensController {
  constructor(private readonly screensService: ScreensService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Post()
  async create(@Body() createScreenDto: CreateScreenDto): Promise<Screen> {
    const { cinema_id } = createScreenDto;
    return this.screensService.create({
      cinema: {
        connect: { cinema_id },
      },
    });
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Screen[]> {
    return this.screensService.findAll();
  }

  // @UseGuards(JwtAuthGuard)
  @Get('screensbycinemaid/:cinemaId')
  async findManyByCinemaId(
    @Param('cinemaId') cinemaId: string,
  ): Promise<Screen[]> {
    return this.screensService.screens({
      where: {
        cinemaId: Number(cinemaId),
      },
    });
  }

  // @UseGuards(JwtAuthGuard)
  @Get('screen/:id')
  async findOne(@Param('id') id: string): Promise<Screen | null> {
    return this.screensService.screen({ screen_id: Number(id) });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Patch('screen/:id')
  async update(
    @Param('id') id: string,
    @Body() updateScreenDto: UpdateScreenDto,
  ) {
    const { cinema_id } = updateScreenDto;
    return this.screensService.update({
      where: { screen_id: Number(id) },
      data: {
        cinema: {
          connect: { cinema_id },
        },
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Delete('screen/:id')
  async remove(@Param('id') id: string): Promise<Screen> {
    return this.screensService.delete({ screen_id: Number(id) });
  }
}
