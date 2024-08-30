import {
  IsOptional,
  IsString,
  IsUUID,
  IsEmail,
  IsBooleanString,
} from 'class-validator';
import { IsType } from '../../common/helpers';
import { Gte, Lte, Lt, Gt } from '../../common/types';
export class SearchUserFilterDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsBooleanString()
  @IsOptional()
  isVerified?: string;

  @IsOptional()
  @IsType(['string', 'gte', 'lte', 'lt', 'gt'])
  createdAt?: string | Gte | Lte | Lt | Gt;

  @IsOptional()
  @IsType(['string', 'gte', 'lte', 'lt', 'gt'])
  updatedAt?: string | Gte | Lte | Lt | Gt;
}
