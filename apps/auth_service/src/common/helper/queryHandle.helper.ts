import {
  OffsetPaginationOptionDto,
  SearchOffsetPaginationDto,
  OffsetPaginationDto,
} from '../dto';
interface Query {
  sort?: string;
  page?: number;
  limit?: number;
  fields?: string;
  searchTerm?: string;
  password?: string;
  skip?: number;
  getAll?: boolean;
  [key: string]: any;
}

export function queryHandle(query: Query) {
  const filterQuery = { ...query };
  const excludedFields = [
    'page',
    'sort',
    'limit',
    'fields',
    'searchTerm',
    'password',
    'skip',
  ];
  excludedFields.forEach((el) => delete filterQuery[el]);
  const sortQuery: { orderBy: string; order: string }[] = [];
  if (query.sort) {
    const sortObj = query.sort.split(',');
    for (const obj of sortObj) {
      const [orderBy, order] = obj.split(':');
      sortQuery.push({
        orderBy,
        order: order ? order.toUpperCase() : order,
      });
    }
  }
  let fieldsQuery: string[] = [];
  if (query.fields) {
    fieldsQuery = query.fields.split(',');
  }
  const offset = new OffsetPaginationDto();
  offset.pageNumber = query.page || offset.pageNumber;
  offset.limit = query.limit || offset.limit;
  offset.skip = query.skip || undefined;
  const options = new OffsetPaginationOptionDto();
  options.isGetAll = query.getAll || undefined;
  const searchOffset = new SearchOffsetPaginationDto();
  searchOffset.pagination = offset;
  searchOffset.options = options;
  return { filterQuery, sortQuery, fieldsQuery, searchOffset };
}
