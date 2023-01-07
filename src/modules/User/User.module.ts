import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/User/User.entity';
import { AuthenticationService } from './Authentication.service';
import { UserService } from './User.service';
import { UserController } from './User.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, AuthenticationService],
  exports: [UserService, AuthenticationService],
})
export class UserModule {}
