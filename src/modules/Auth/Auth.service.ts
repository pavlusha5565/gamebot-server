import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ERole, UserEntity } from 'src/database/entities/User/User.entity';
import * as bcrypt from 'bcrypt';
import { UserService } from '../User/User.service';
import { JwtService } from '@nestjs/jwt';
import { PostgresErrorCode } from 'src/common/constants/postgres.enum';
import { RegisterDto } from '../User/User.interfaces';
import { ConfigService } from '@nestjs/config';
import { ITokenPayload } from './Auth.interface';
import { AppConfigService } from 'src/config/app/appConfig.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  Session,
  SessionEntity,
} from 'src/database/entities/User/Session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { applyObject } from 'src/utils/object';
import { checkExist } from 'src/utils/exeptions';

export interface ITokenData {
  token: string;
  expiresIn: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    private readonly configService: AppConfigService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registration new user with hashing and salting password.
   */
  public async register(registrationData: RegisterDto): Promise<UserEntity> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registrationData.password, salt);
    try {
      const user = await this.userService.createUser({
        ...registrationData,
        role: ERole.User,
        password: hashedPassword,
      });
      return user;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          `User with ${registrationData.email} already exists`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new InternalServerErrorException();
    }
  }

  /**
   * Generate auth token
   * @param userId UserEntity.id
   * @param email UserEntity.email
   * @returns jwt token
   */
  public getAuthToken(userId: string, email: string): ITokenData {
    const payload: ITokenPayload = { userId, email };
    const expiresIn = this.configService.getField('jwtExpiresIn');
    const token = this.jwtService.sign(payload, {
      secret: this.configService.getField('jwtSecret'),
      expiresIn,
    });
    return {
      token,
      expiresIn,
    };
  }

  /**
   * Generate refresh token
   * @param userId UserEntity.id
   * @param email UserEntity.email
   * @returns jwt token
   */
  public getRefreshToken(userId: string, email: string): ITokenData {
    const payload: ITokenPayload = { userId, email };
    const expiresIn = this.configService.getField('jwtRefreshExpiresIn');
    const token = this.jwtService.sign(payload, {
      secret: this.configService.getField('jwtRefreshSecret'),
      expiresIn: expiresIn,
    });
    return {
      token,
      expiresIn,
    };
  }

  /**
   * Make cookie string data for auth token
   * @param token jwt token
   * @returns Cookie string
   */
  public generateAuthCookie(token: string, expiresIn: string): string {
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`;
  }

  /**
   * Make cookie string data for refresh token
   * @param token jwt token
   * @returns Cookie string
   */
  public generateRefreshCookie(token: string, expiresIn: string): string {
    return `Refresh=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`;
  }

  public generateLogoutCookie() {
    return {
      auth: `Authentication=; HttpOnly; Path=/; Max-Age=`,
      refresh: `Refresh=; HttpOnly; Path=/; Max-Age=`,
    };
  }

  public async findByUserId(userId: string): Promise<SessionEntity> {
    return this.queryBuilder.where('user.id = :id', { id: userId }).getOne();
  }

  public async createSession(user: UserEntity): Promise<SessionEntity> {
    // todo, временная мера, ограничивающая 1й авторизацией.
    // Нужно добавить больше уникальных данных, для различия сессий
    // (типа id компьютера, браузер и тд)
    await this.deleteSession(user.id);
    const session = new SessionEntity();
    const refreshTokenData = this.getRefreshToken(user.id, user.email);
    applyObject(session, {
      refreshToken: refreshTokenData.token,
      user: user,
      expiresIn: refreshTokenData.expiresIn,
      lastAccessAt: new Date(),
    });
    return this.sessionRepository.save(session);
  }

  public async updateSession(
    userId: string,
    payload: Partial<Session>,
  ): Promise<SessionEntity> {
    const session = await this.findByUserId(userId);
    checkExist(session);
    applyObject(session, payload);
    return this.sessionRepository.save(session);
  }

  public async deleteSession(userId: string): Promise<SessionEntity> {
    const session = await this.findByUserId(userId);
    if (!session) {
      return;
    }
    return this.sessionRepository.remove(session);
  }

  public async validateRefreshToken(
    token: string,
    userId: string,
  ): Promise<UserEntity | null> {
    const session = await this.findByUserId(userId);
    if (session.refreshToken === token) {
      applyObject(session, { lastAccessAt: new Date() });
      this.sessionRepository.save(session);
      return session.user;
    }
    return null;
  }

  /**
   * Validate user and password
   * @param email UserEntity.email
   * @param plainTextPassword Plain text password
   * @returns UserEntity or Make Http Exeption
   */
  public async validateUser(
    email: string,
    plainTextPassword: string,
  ): Promise<UserEntity> {
    try {
      const user = await this.userService.findByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Compare text password and hashed
   * @param plainTextPassword text password
   * @param hashedPassword Hashed and salted password
   */
  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private get queryBuilder(): SelectQueryBuilder<SessionEntity> {
    const query = this.sessionRepository.createQueryBuilder('session');
    query.leftJoinAndSelect('session.user', 'user');
    return query;
  }
}
