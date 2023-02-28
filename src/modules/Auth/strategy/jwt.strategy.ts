import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { AppConfigService } from 'src/config/app/appConfig.service';
import { AuthService } from 'src/modules/Auth/Auth.service';
import { ITokenPayload } from '../Auth.interface';
import { UserService } from 'src/modules/User/User.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-auth') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: AppConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.getField('jwtSecret'),
      passReqToCallback: true,
    });
  }

  public async validate(
    request: Request,
    payload: ITokenPayload,
  ): Promise<any> {
    const user = await this.userService.findById(payload.userId);
    if (user) {
      return user;
    }
    throw new HttpException('Token validate fail', HttpStatus.UNAUTHORIZED);
  }
}
