import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ScreensService } from './screens.service';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { Screen } from '@prisma/client';

@Controller('screens')
export class ScreensController {
  constructor(private readonly screensService: ScreensService) {}

  @Post()
  async create(@Body() createScreenDto: CreateScreenDto): Promise<Screen> {
    const { cinema_id } = createScreenDto;
    return this.screensService.create({
      cinema: {
        connect: { cinema_id },
      },
    });
  }

  @Get()
  async findAll(): Promise<Screen[]> {
    return this.screensService.findAll();
  }

  @Get('screen/:id')
  async findOne(@Param('id') id: string): Promise<Screen | null> {
    return this.screensService.screen({ screen_id: Number(id) });
  }

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

  @Delete('screen/:id')
  async remove(@Param('id') id: string): Promise<Screen> {
    return this.screensService.delete({ screen_id: Number(id) });
  }
}
