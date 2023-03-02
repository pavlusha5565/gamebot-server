import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SessionEntity } from 'src/database/entities/User/Session.entity';
import { UserEntity } from 'src/database/entities/User/User.entity';
import { parseJwt } from 'src/utils/object';
import { PUser } from '../User/User.decorator';
import { RegisterDto } from '../User/User.interfaces';
import { UserService } from '../User/User.service';
import { ITokenPayload } from './Auth.interface';
import { AuthService } from './Auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
@SerializeOptions({
  strategy: 'excludeAll',
})
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  public async register(
    @Body() registerData: RegisterDto,
  ): Promise<UserEntity> {
    return this.authService.register(registerData);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  public async login(
    @PUser() user: UserEntity,
    @Res() response: Response,
  ): Promise<Response<SessionEntity>> {
    const session = await this.authService.createSession(user);
    const authToken = this.authService.getAuthToken(user.id, user.email);

    const authCookie = this.authService.generateAuthCookie(authToken.token);
    const refreshCookie = this.authService.generateRefreshCookie(
      session.refreshToken,
    );

    response.setHeader('Set-Cookie', [authCookie, refreshCookie]);
    user.password = undefined;
    return response.send(session);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  public async refresh(@PUser() user: UserEntity, @Res() response: Response) {
    const token = this.authService.getAuthToken(user.id, user.email);
    response.setHeader(
      'Set-Cookie',
      this.authService.generateAuthCookie(token.token),
    );
    return response.sendStatus(200);
  }

  @Post('logout')
  public async logout(
    @PUser() user: UserEntity,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const token: string | undefined = request?.cookies?.Refresh;
    const jwtPayload: ITokenPayload = parseJwt<ITokenPayload>(token);
    console.log(request?.cookies);

    this.authService.deleteSession(jwtPayload.userId, jwtPayload.sessionId);
    const cookie = this.authService.generateLogoutCookie();
    response.setHeader('Set-Cookie', [cookie.auth, cookie.refresh]);
    return response.sendStatus(200);
  }
}
