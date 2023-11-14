import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cinema, Prisma } from '@prisma/client';

@Injectable()
export class CinemasService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CinemaCreateInput): Promise<Cinema> {
    return this.prisma.cinema.create({
      data,
    });
  }

  async cinema(
    cinemaWhereUniqueInput: Prisma.CinemaWhereUniqueInput,
  ): Promise<Cinema | null> {
    return this.prisma.cinema.findUnique({
      where: cinemaWhereUniqueInput,
    });
  }

  async cinemas(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CinemaWhereUniqueInput;
    where?: Prisma.CinemaWhereInput;
    orderBy?: Prisma.CinemaOrderByWithRelationInput;
  }): Promise<Cinema[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.cinema.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findAll(): Promise<Cinema[]> {
    return this.prisma.cinema.findMany();
  }

  async update(params: {
    where: Prisma.CinemaWhereUniqueInput;
    data: Prisma.CinemaUpdateInput;
  }): Promise<Cinema> {
    const { data, where } = params;
    return this.prisma.cinema.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.CinemaWhereUniqueInput): Promise<Cinema> {
    return this.prisma.cinema.delete({
      where,
    });
  }
}
