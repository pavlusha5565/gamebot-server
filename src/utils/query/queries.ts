import { Shape } from 'src/common/interfaces/utils.interface';
import { SelectQueryBuilder } from 'typeorm';

export function addWhere<T extends object>(
  query: SelectQueryBuilder<T>,
  property: Partial<T> | Shape,
  alias?: string,
): SelectQueryBuilder<T> {
  const queryAlias = alias || query.alias;
  Object.keys(property)
    .filter((key) => property[key])
    .forEach((key) => {
      if (typeof property[key] === 'object') {
        addWhere(query, property[key], key);
      } else {
        query.andWhere(`${queryAlias}.${key} = :${alias}_${key}`, {
          [`${alias}_${key}`]: property[key],
        });
      }
    });
  return query;
}

export function orWhere<T extends object>(
  query: SelectQueryBuilder<T>,
  property: Partial<T> | Shape,
) {
  Object.keys(property)
    .filter((x) => property[x])
    .forEach((key) => {
      query.orWhere(`${query.alias}.${key} = :${key}`, property);
    });
  return query;
}
