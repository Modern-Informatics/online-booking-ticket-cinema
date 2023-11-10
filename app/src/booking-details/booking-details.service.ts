import { Injectable } from '@nestjs/common';
import { BookingDetail, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingDetailsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.BookingDetailCreateInput): Promise<BookingDetail> {
    return this.prisma.bookingDetail.create({
      data,
    });
  }

  async bookingDetail(
    bookingDetailWhereUniqueInput: Prisma.BookingDetailWhereUniqueInput,
  ): Promise<BookingDetail | null> {
    return this.prisma.bookingDetail.findUnique({
      where: bookingDetailWhereUniqueInput,
    });
  }

  async bookingDetails(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BookingDetailWhereUniqueInput;
    where?: Prisma.BookingDetailWhereInput;
    orderBy?: Prisma.BookingDetailOrderByWithRelationInput;
  }): Promise<BookingDetail[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.bookingDetail.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findAll(): Promise<BookingDetail[]> {
    return this.prisma.bookingDetail.findMany();
  }

  async update(params: {
    where: Prisma.BookingDetailWhereUniqueInput;
    data: Prisma.BookingDetailUpdateInput;
  }): Promise<BookingDetail> {
    const { where, data } = params;
    return this.prisma.bookingDetail.update({
      data,
      where,
    });
  }

  async delete(
    where: Prisma.BookingDetailWhereUniqueInput,
  ): Promise<BookingDetail> {
    return this.prisma.bookingDetail.delete({
      where,
    });
  }
}
