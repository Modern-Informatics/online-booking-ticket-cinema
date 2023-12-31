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
import { ShowsService } from './shows.service';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { Role, Show } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('shows')
export class ShowsController {
  constructor(private readonly showsService: ShowsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Post()
  async create(@Body() createShowDto: CreateShowDto): Promise<Show> {
    const { movieId, screenId, startAt, endAt } = createShowDto;
    return this.showsService.create({
      movie: {
        connect: { movie_id: movieId },
      },
      screen: {
        connect: { screen_id: screenId },
      },
      startAt,
      endAt,
    });
  }

  @Get()
  async findAll(): Promise<Show[]> {
    return this.showsService.findAll();
  }

  @Get('showsbyscreenid/:screenId')
  async findManyByScreenId(
    @Param('screenId') screenId: string,
  ): Promise<Show[]> {
    return this.showsService.shows({
      where: {
        screenId: Number(screenId),
      },
    });
  }

  @Get('showsbymovieId/:movieId')
  async findManyByMovieId(@Param('movieId') movieId: string): Promise<Show[]> {
    return this.showsService.shows({
      where: {
        movieId: Number(movieId),
      },
    });
  }

  @Get('show/:id')
  async findOne(@Param('id') id: string): Promise<Show> {
    return this.showsService.show({ show_id: Number(id) });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Delete('show/:id')
  async delete(@Param('id') id: string): Promise<Show> {
    return this.showsService.delete({ show_id: Number(id) });
  }
}
