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

export interface Paginate<T> {
  data: T[];
  paginate: IPaginateResponse;
}

export interface PaginateInput<T> {
  data: T;
  page?: IPaginateInput;
}

export type TTransformer<T> = (data: T[]) => T[];

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
  input?: IPaginateInput,
  transformer: TTransformer<T> = (x) => x,
): Promise<Paginate<T>> {
  const options: IPaginateResponse = {
    ...paginationDefault,
    itemCount: await query.getCount(),
    page: input?.page || paginateInputDefault.page,
    limit: input?.limit || paginateInputDefault.limit,
  };

  options.pageCount = Math.ceil(options.itemCount / options.limit);
  options.page =
    options.page < 1
      ? 1
      : options.page > options.pageCount
      ? options.pageCount
      : options.page;

  options.hasNextPage = options.page < options.pageCount;
  options.hasPrevPage = options.page > 1;

  const skip = options.page < 1 ? 0 : options.page - 1;

  query.take(options.limit);
  query.skip(skip);

  return {
    data: transformer(await query.getMany()),
    paginate: options,
  };
}
