import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserEntity } from 'src/database/entities/User/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserService } from './User.service';
import {
  checkExist,
  checkField,
  InternalServerError,
} from 'src/utils/exeptions';
import { PostgresErrorCode } from 'src/common/constants/postgres.enum';
import { check } from 'prettier';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  public async register(user: User) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    checkField<User>(user, 'password');
    try {
      const createdUser = await this.userService.createUser({
        ...user,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          `User with email ${user.email} already exists`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new InternalServerError();
    }
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.userService.findByEmail(email);
      checkExist(user);
      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong password provided',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordCompare = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordCompare) {
      throw new HttpException(
        'Wrong password provided',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
