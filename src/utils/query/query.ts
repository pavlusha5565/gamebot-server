import { SelectQueryBuilder } from 'typeorm';

export function addWhere<T extends object>(
  query: SelectQueryBuilder<T>,
  property: { [key: string]: any },
): SelectQueryBuilder<T> {
  Object.keys(property).forEach((key) => {
    query.andWhere(`${query.alias}.${key} = :${key}`, property);
  });
  return query;
}

export function orWhere<T extends object>(
  query: SelectQueryBuilder<T>,
  property: { [key: string]: any },
) {
  Object.keys(property).forEach((key) => {
    query.orWhere(`${query.alias}.${key} = :${key}`, property);
  });
  return query;
}
