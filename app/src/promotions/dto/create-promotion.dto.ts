import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePromotionDto {
  @IsNumber()
  @IsNotEmpty()
  cinemaId: number;

  @IsString()
  @IsNotEmpty()
  promo_code: string;

  @IsNumber()
  @IsNotEmpty()
  discount_amount: number;

  @IsDate()
  @IsNotEmpty()
  startAt: Date;

  @IsDate()
  @IsNotEmpty()
  expirationAt: Date;
}
