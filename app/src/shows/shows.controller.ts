import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShowsService } from './shows.service';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { Show } from '@prisma/client';

@Controller('shows')
export class ShowsController {
  constructor(private readonly showsService: ShowsService) {}

  @Post()
  async create(@Body() createShowDto: CreateShowDto): Promise<Show> {
    const { movieId, screenId } = createShowDto;
    return this.showsService.create({
      movie: {
        connect: { movie_id: movieId },
      },
      screen: {
        connect: { screen_id: screenId },
      },
    });
  }

  @Get()
  async findAll(): Promise<Show[]> {
    return this.showsService.findAll();
  }

  @Get('show/:id')
  async findOne(@Param('id') id: string): Promise<Show> {
    return this.showsService.show({ show_id: Number(id) });
  }

  @Patch('show/:id')
  async update(@Param('id') id: string, @Body() updateShowDto: UpdateShowDto) {
    return this.showsService.update({
      where: { show_id: Number(id) },
      data: {
        movie: {
          connect: { movie_id: Number(updateShowDto.movieId) },
        },
        screen: {
          connect: { screen_id: Number(updateShowDto.screenId) },
        },
      },
    });
  }

  @Delete('show/:id')
  async delete(@Param('id') id: string): Promise<Show> {
    return this.showsService.delete({ show_id: Number(id) });
  }
}
