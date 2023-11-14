import { PartialType } from '@nestjs/mapped-types';
import { CreateShowSeatDto } from './create-show-seat.dto';

export class UpdateShowSeatDto extends PartialType(CreateShowSeatDto) {}
