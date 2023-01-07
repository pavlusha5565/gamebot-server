import { SelectQueryBuilder } from 'typeorm';

export interface IPaginateInput {
  page: number;
  limit: number;
}

export interface IPaginateResponse {
  page: number;
  pageCount: number;
  itemCount: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  limit: number;
}

export interface IPaginate<T> {
  data: T;
  paginate: IPaginateResponse;
}

export const paginateInputDefault: IPaginateInput = {
  page: 1,
  limit: 20,
};

const paginationDefault: IPaginateResponse = {
  page: 1,
  pageCount: 1,
  itemCount: 1,
  hasPrevPage: false,
  hasNextPage: false,
  limit: paginateInputDefault.limit,
};

export async function paginate<T>(
  query: SelectQueryBuilder<T>,
  input: IPaginateInput = paginateInputDefault,
): Promise<IPaginate<T[]>> {
  const optionsInput = { ...paginateInputDefault, ...input };
  const options: IPaginateResponse = {
    ...paginationDefault,
    limit: optionsInput.limit,
  };

  options.itemCount = await query.getCount();
  options.pageCount = Math.ceil(options.itemCount / optionsInput.limit);
  options.page =
    optionsInput.page > options.pageCount
      ? options.pageCount
      : optionsInput.page;

  if (options.page < 1) {
    options.page = 1;
  }
  if (options.page > options.pageCount) {
    options.page = options.pageCount;
  }

  options.hasNextPage = options.page < options.pageCount;
  options.hasPrevPage = options.page > 1;

  query.limit(optionsInput.limit).take(options.page);
  return { paginate: options, data: await query.getMany() };
}
