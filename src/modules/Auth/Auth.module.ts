import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../User/User.module';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from 'src/config/app/appConfig.module';
import { AppConfigService } from 'src/config/app/appConfig.service';
import { AuthService } from './Auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from './Auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from 'src/database/entities/User/Session.entity';
import { JwtRefreshStrategy } from './strategy/jwtRefresh.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity]),
    UserModule,
    AppConfigModule,
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
