import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHello(): Promise<string> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return 'Hello World!';
    } catch (error) {
      console.error('PRISMA TEST ERROR:', error);
      throw error;
    }
  }
}
