import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Screen } from '@prisma/client';

@Injectable()
export class ScreensService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ScreenCreateInput): Promise<Screen> {
    return this.prisma.screen.create({
      data,
    });
  }

  async screen(
    screenWhereUniqueInput: Prisma.ScreenWhereUniqueInput,
  ): Promise<Screen | null> {
    return this.prisma.screen.findUnique({
      where: screenWhereUniqueInput,
    });
  }

  async screens(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ScreenWhereUniqueInput;
    where?: Prisma.ScreenWhereInput;
    orderBy?: Prisma.ScreenOrderByWithRelationInput;
  }): Promise<Screen[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.screen.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findAll(): Promise<Screen[]> {
    return this.prisma.screen.findMany();
  }

  async update(params: {
    where: Prisma.ScreenWhereUniqueInput;
    data: Prisma.ScreenUpdateInput;
  }): Promise<Screen> {
    const { data, where } = params;
    return this.prisma.screen.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.ScreenWhereUniqueInput): Promise<Screen> {
    return this.prisma.screen.delete({
      where,
    });
  }
}
