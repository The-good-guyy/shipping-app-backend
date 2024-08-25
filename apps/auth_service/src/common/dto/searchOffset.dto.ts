// import { Field, InputType } from '@nestjs/graphql';
// import { SearchOffsetPaginationDto } from '@common/searchOffsetPagination.dto';
// import { EVesselOrderBy } from '../vessel.enum';

// @InputType()
// export class SearchOffsetVesselDto extends SearchOffsetPaginationDto {
//   @Field(() => EVesselOrderBy)
//   orderBy?: EVesselOrderBy = EVesselOrderBy.createdAt;
// }
import { OrderBy } from '../constants';
import { SearchOffsetPaginationDto } from './searchOffsetPagination.dto';
import { IsEnum, IsOptional } from 'class-validator';
export class SearchOffsetDto extends SearchOffsetPaginationDto {
  @IsOptional()
  @IsEnum(OrderBy)
  orderBy?: OrderBy = OrderBy.createdAt;
}
