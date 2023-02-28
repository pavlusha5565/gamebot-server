import {
  Body,
  Controller,
  Post,
  Res,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { SessionEntity } from 'src/database/entities/User/Session.entity';
import { UserEntity } from 'src/database/entities/User/User.entity';
import { User } from '../User/User.decorator';
import { RegisterDto } from '../User/User.interfaces';
import { UserService } from '../User/User.service';
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
  async register(@Body() registerData: RegisterDto): Promise<UserEntity> {
    return this.authService.register(registerData);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @User() user: UserEntity,
    @Res() response: Response,
  ): Promise<Response<SessionEntity>> {
    const session = await this.authService.createSession(user);
    const authToken = this.authService.getAuthToken(user.id, user.email);

    const authCookie = this.authService.generateAuthCookie(
      authToken.token,
      authToken.expiresIn,
    );
    const refreshCookie = this.authService.generateRefreshCookie(
      session.refreshToken,
      session.expiresIn,
    );

    response.setHeader('Set-Cookie', [authCookie, refreshCookie]);
    user.password = undefined;
    return response.send(session);
  }

  @Post('refresh')
  // @UseGuards(JwtRefreshGuard)
  @UseGuards(JwtAuthGuard)
  async refresh(@User() user: UserEntity, @Res() response: Response) {
    const token = this.authService.getAuthToken(user.id, user.email);
    response.setHeader(
      'Set-Cookie',
      this.authService.generateAuthCookie(token.token, token.expiresIn),
    );
    return response.sendStatus(200);
  }

  @Post('logout')
  @UseGuards(JwtRefreshGuard)
  async logout(@User() user: UserEntity, @Res() response: Response) {
    this.authService.deleteSession(user.id);
    const cookie = this.authService.generateLogoutCookie();
    response.setHeader('Set-Cookie', [cookie.auth, cookie.refresh]);
    return response.sendStatus(200);
  }
}
