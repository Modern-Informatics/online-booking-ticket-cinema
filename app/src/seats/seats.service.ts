import { Injectable } from '@nestjs/common';
import { Prisma, Seat } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SeatsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.SeatCreateInput): Promise<Seat> {
    return this.prisma.seat.create({
      data,
    });
  }

  async seat(
    seatWhereUniqueInput: Prisma.SeatWhereUniqueInput,
  ): Promise<Seat | null> {
    return this.prisma.seat.findUnique({
      where: seatWhereUniqueInput,
    });
  }

  async seats(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SeatWhereUniqueInput;
    where?: Prisma.SeatWhereInput;
    orderBy?: Prisma.SeatOrderByWithRelationInput;
  }): Promise<Seat[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.seat.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findAll(): Promise<Seat[]> {
    return this.prisma.seat.findMany();
  }

  async update(params: {
    where: Prisma.SeatWhereUniqueInput;
    data: Prisma.SeatUpdateInput;
  }): Promise<Seat> {
    const { data, where } = params;
    return this.prisma.seat.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.SeatWhereUniqueInput): Promise<Seat> {
    return this.prisma.seat.delete({
      where,
    });
  }
}
