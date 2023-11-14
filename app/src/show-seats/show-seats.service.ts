import { Injectable } from '@nestjs/common';
import { Prisma, ShowSeat } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShowSeatsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ShowSeatCreateInput): Promise<ShowSeat> {
    return this.prisma.showSeat.create({
      data,
    });
  }

  async showSeat(
    showSeatWhereUniqueInput: Prisma.ShowSeatWhereUniqueInput,
  ): Promise<ShowSeat | null> {
    return this.prisma.showSeat.findUnique({
      where: showSeatWhereUniqueInput,
    });
  }

  async showSeats(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ShowSeatWhereUniqueInput;
    where?: Prisma.ShowSeatWhereInput;
    orderBy?: Prisma.ShowSeatOrderByWithRelationInput;
  }): Promise<ShowSeat[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.showSeat.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findAll(): Promise<ShowSeat[]> {
    return this.prisma.showSeat.findMany();
  }

  async update(params: {
    where: Prisma.ShowSeatWhereUniqueInput;
    data: Prisma.ShowSeatUpdateInput;
  }): Promise<ShowSeat> {
    const { where, data } = params;
    return this.prisma.showSeat.update({
      where,
      data,
    });
  }

  async delete(where: Prisma.ShowSeatWhereUniqueInput): Promise<ShowSeat> {
    return this.prisma.showSeat.delete({
      where,
    });
  }
}
