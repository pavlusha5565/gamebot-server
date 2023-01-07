import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(msg?: string, err?: any) {
    console.error(msg, HttpStatus.FORBIDDEN, err);
    super(msg || 'Forbidden', HttpStatus.FORBIDDEN);
  }
}

export class NotExistExeption extends HttpException {
  constructor(msg?: string, err?: any) {
    console.error(msg, HttpStatus.NOT_FOUND, err);
    super(msg || 'Not exits data', HttpStatus.NOT_FOUND);
  }
}

export class InternalServerError extends HttpException {
  constructor(msg?: string, err?: any) {
    console.error(msg, HttpStatus.INTERNAL_SERVER_ERROR, err);
    super(msg || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export function checkExist(target: any, msg?: string) {
  if (!target) {
    throw new NotExistExeption(msg || '404 not found', target);
  }
}

export function checkField<T extends object>(target: T, field: keyof T) {
  checkExist(target);
  if (!target[field]) {
    throw new HttpException(
      `${String(field)} in not nullable`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
