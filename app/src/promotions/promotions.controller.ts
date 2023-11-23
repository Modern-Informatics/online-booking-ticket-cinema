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
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Promotion, Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CINEMA)
  @Post()
  async create(
    @Body() createPromotionDto: CreatePromotionDto,
  ): Promise<Promotion> {
    const { cinemaId, promo_code, discount_amount, startAt, expirationAt } =
      createPromotionDto;
    return this.promotionsService.create({
      cinema: {
        connect: { cinema_id: Number(cinemaId) },
      },
      promo_code,
      discount_amount,
      startAt,
      expirationAt,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Promotion[]> {
    return this.promotionsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('promotionsbycinemaid/:cinemaId')
  async findManyByCinemaId(
    @Param('cinemaId') cinemaId: string,
  ): Promise<Promotion[]> {
    return this.promotionsService.promotions({
      where: {
        cinemaId: Number(cinemaId),
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('promotion/:id')
  async findOne(@Param('id') id: string): Promise<Promotion> {
    return this.promotionsService.promotion({ promotion_id: Number(id) });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CINEMA)
  @Patch('promotion/:id')
  async update(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ): Promise<Promotion> {
    const { cinemaId, promo_code, discount_amount, startAt, expirationAt } =
      updatePromotionDto;
    return this.promotionsService.update({
      where: { promotion_id: Number(id) },
      data: {
        cinema: {
          connect: { cinema_id: Number(cinemaId) },
        },
        promo_code,
        discount_amount,
        startAt,
        expirationAt,
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CINEMA)
  @Delete('promotion/:id')
  async delete(@Param('id') id: string): Promise<Promotion> {
    return this.promotionsService.delete({ promotion_id: Number(id) });
  }
}
