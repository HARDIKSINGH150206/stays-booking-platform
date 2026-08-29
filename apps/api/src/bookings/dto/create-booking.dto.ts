import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  userId!: string;

  @IsUUID()
  stayId!: string;

  @IsDateString()
  checkIn!: string;

  @IsDateString()
  checkOut!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  guests!: number;
}
