import { Injectable } from '@nestjs/common';
import { Prisma, Promotion } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PromotionCreateInput): Promise<Promotion> {
    return this.prisma.promotion.create({
      data,
    });
  }

  async promotion(
    promotionWhereUniqueInput: Prisma.PromotionWhereUniqueInput,
  ): Promise<Promotion | null> {
    return this.prisma.promotion.findUnique({
      where: promotionWhereUniqueInput,
    });
  }

  async promotions(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PromotionWhereUniqueInput;
    where?: Prisma.PromotionWhereInput;
    orderBy?: Prisma.PromotionOrderByWithRelationInput;
  }): Promise<Promotion[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.promotion.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findAll(): Promise<Promotion[]> {
    return this.prisma.promotion.findMany();
  }

  async update(params: {
    where: Prisma.PromotionWhereUniqueInput;
    data: Prisma.PromotionUpdateInput;
  }): Promise<Promotion> {
    const { where, data } = params;
    return this.prisma.promotion.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.PromotionWhereUniqueInput): Promise<Promotion> {
    return this.prisma.promotion.delete({
      where,
    });
  }
}
