import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { StaysModule } from './stays/stays.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [PrismaModule, StaysModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}