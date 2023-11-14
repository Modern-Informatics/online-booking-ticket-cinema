import { Injectable } from '@nestjs/common';
import { Prisma, Show } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShowsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ShowCreateInput): Promise<Show> {
    return this.prisma.show.create({
      data,
    });
  }

  async show(
    showWhereUniqueInput: Prisma.ShowWhereUniqueInput,
  ): Promise<Show | null> {
    return this.prisma.show.findUnique({
      where: showWhereUniqueInput,
    });
  }

  async shows(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ShowWhereUniqueInput;
    where?: Prisma.ShowWhereInput;
    orderBy?: Prisma.ShowOrderByWithRelationInput;
  }): Promise<Show[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.show.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findAll(): Promise<Show[]> {
    return this.prisma.show.findMany();
  }

  async update(params: {
    where: Prisma.ShowWhereUniqueInput;
    data: Prisma.ShowUpdateInput;
  }): Promise<Show> {
    const { data, where } = params;
    return this.prisma.show.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.ShowWhereUniqueInput): Promise<Show> {
    return this.prisma.show.delete({
      where,
    });
  }
}
