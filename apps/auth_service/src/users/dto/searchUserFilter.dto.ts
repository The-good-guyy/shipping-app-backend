import {
  IsOptional,
  IsString,
  IsUUID,
  IsEmail,
  IsBooleanString,
} from 'class-validator';
import { IsType } from '../../common/helpers';
export type Gte = {
  gte: string;
};
export type Lte = {
  lte: string;
};
export type Lt = {
  lt: string;
};
export type Gt = {
  gt: string;
};
export class searchUserFilterDto {
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
  createdAt?: object | string;

  @IsOptional()
  @IsType(['string', 'gte', 'lte', 'lt', 'gt'])
  updatedAt?: object | string;
}
