import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { AppConfigService } from 'src/config/app/appConfig.service';
import { ITokenPayload } from '../Auth.interface';
import { UserService } from 'src/modules/User/User.service';
import { AuthService } from '../Auth.service';
import { parseJwt } from 'src/utils/object';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: AppConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: configService.getField('jwtRefreshSecret'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: ITokenPayload): Promise<any> {
    const token: string | undefined = request?.cookies?.Refresh;
    const jwtPayload: ITokenPayload = parseJwt<ITokenPayload>(token);
    console.log(jwtPayload);
    const user = await this.authService.validateRefreshToken(
      token,
      payload.userId,
      jwtPayload.sessionId,
    );
    if (user) {
      return user;
    }
    throw new HttpException(
      'Refresh token validate fail',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
