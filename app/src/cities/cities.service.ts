import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { City, Prisma } from '@prisma/client';

@Injectable()
export class CitiesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CityCreateInput): Promise<City> {
    return this.prisma.city.create({
      data,
    });
  }

  async findAll() {
    return await this.prisma.city.findMany();
  }

  async city(
    cityWhereUniqueInput: Prisma.CityWhereUniqueInput,
  ): Promise<City | null> {
    return this.prisma.city.findUnique({
      where: cityWhereUniqueInput,
    });
  }

  async cities(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CityWhereUniqueInput;
    where?: Prisma.CityWhereInput;
    orderBy?: Prisma.CityOrderByWithRelationInput;
  }): Promise<City[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.city.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async update(params: {
    where: Prisma.CityWhereUniqueInput;
    data: Prisma.CityUpdateInput;
  }): Promise<City> {
    const { where, data } = params;
    return this.prisma.city.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.CityWhereUniqueInput): Promise<City> {
    return this.prisma.city.delete({
      where,
    });
  }
}
