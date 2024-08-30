import { Gte, Lt, Lte, Gt } from '../../common/types';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  IsBooleanString,
} from 'class-validator';
import { IsType } from '../../common/helpers';
export class SearchUsersDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => {
    return Number(value);
  })
  page?: number;

  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsInt()
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsInt()
  skip?: number;

  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsOptional()
  email?: string;

  @IsBooleanString()
  @IsOptional()
  isVerified?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') return new Date(value);
    if (value.gte) value.gte = new Date(value.gte);
    if (value.lte) value.lte = new Date(value.lte);
    if (value.gt) value.gt = new Date(value.gt);
    return value;
  })
  @IsType(['date', 'gte', 'lte', 'lt', 'gt'])
  createdAt?: Date | Gte | Lte | Lt | Gt;

  @IsOptional()
  @Transform(({ value }) => {
    return typeof value === 'string' ? new Date(value) : value;
  })
  @IsType(['date', 'gte', 'lte', 'lt', 'gt'])
  updatedAt?: Date | Gte | Lte | Lt | Gt;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  fields?: string;

  @IsOptional()
  searchTerm?: string;
}
