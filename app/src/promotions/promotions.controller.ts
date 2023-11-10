import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Promotion } from '@prisma/client';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

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

  @Get()
  async findAll(): Promise<Promotion[]> {
    return this.promotionsService.findAll();
  }

  @Get('promotion/:id')
  async findOne(@Param('id') id: string): Promise<Promotion> {
    return this.promotionsService.promotion({ promotion_id: Number(id) });
  }

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

  @Delete('promotion/:id')
  async delete(@Param('id') id: string): Promise<Promotion> {
    return this.promotionsService.delete({ promotion_id: Number(id) });
  }
}
