import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListStaysDto } from './dto/list-stays.dto';

@Injectable()
export class StaysService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListStaysDto) {
    const { city, state, guests, page = 1, limit = 20 } = query;

    const where = {
      ...(city ? { city: { equals: city, mode: 'insensitive' as const } } : {}),
      ...(state
        ? { state: { equals: state, mode: 'insensitive' as const } }
        : {}),
      ...(guests !== undefined ? { maxGuests: { gte: guests } } : {}),
    };

    const [stays, total] = await Promise.all([
      this.prisma.stay.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.stay.count({ where }),
    ]);

    return {
      data: stays,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const stay = await this.prisma.stay.findUnique({
      where: { id },
    });

    if (!stay) {
      throw new NotFoundException('Stay not found');
    }

    return stay;
  }
}
