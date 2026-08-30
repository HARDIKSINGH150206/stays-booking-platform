import { IsDateString } from 'class-validator';

export class CheckAvailabilityDto {
  @IsDateString()
  checkIn!: string;

  @IsDateString()
  checkOut!: string;
}
