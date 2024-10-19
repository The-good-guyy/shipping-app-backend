import {
  MoreThan,
  LessThan,
  LessThanOrEqual,
  MoreThanOrEqual,
  ILike,
  Like,
  Not,
} from 'typeorm';
export function filterHandle(filters: object) {
  const newFilters = {};
  for (const key in filters) {
    const value = filters[key];
    if (typeof value === 'object' && value !== null) {
      if (value.gte !== null && value.gte !== undefined) {
        filters[key] = MoreThanOrEqual(value.gte);
      } else if (value.gt !== null && value.gt !== undefined) {
        filters[key] = MoreThan(value.gt);
      } else if (value.lte !== null && value.lte !== undefined)
        filters[key] = LessThanOrEqual(value.lte);
      else if (value.lt !== null && value.lt !== undefined)
        filters[key] = LessThan(value.lt);
      else if (value.ne !== null && value.ne !== undefined)
        filters[key] = Not(value.ne);
      else if (value.il !== null && value.il !== undefined)
        filters[key] = ILike(`%${value.ilike}%`);
      else if (value.like !== null && value.like !== undefined)
        filters[key] = Like(`%${value.like}%`);
    }
    const newValues = filters[key];
    const keyValue = key.split('_');
    let o = newFilters;
    for (let i = 0; i < keyValue.length - 1; i++) {
      const prop = keyValue[i];
      o[prop] = o[prop] || {};
      o = o[prop];
    }
    o[keyValue[keyValue.length - 1]] = newValues;
  }
  return newFilters;
}
