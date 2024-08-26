import { PartialType } from '@nestjs/mapped-types';
import { CreatePortDto } from './create-port.dto';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdatePortDto extends PartialType(CreatePortDto) {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lon?: number;
}
