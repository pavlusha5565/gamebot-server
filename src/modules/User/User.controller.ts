import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { ERole, UserEntity } from 'src/database/entities/User/User.entity';
import { checkExist } from 'src/utils/exeptions';
import { IPaginateInput } from 'src/utils/query/pagination';
import { JwtAuthGuard } from '../Auth/guard/jwt-auth.guard';
import { PUser } from './User.decorator';
import { RegisterDto } from './User.interfaces';
import { UserService } from './User.service';

@Controller('user')
@SerializeOptions({
  strategy: 'excludeAll',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  public async findAll(
    @PUser() user: UserEntity,
    @Body() paginate: IPaginateInput,
  ) {
    this.checkAdmin(user.role);
    return this.userService.findAll(paginate);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async findUser(@PUser() user: UserEntity, @Param('id') id: string) {
    this.checkAdmin(user.role);
    const findUser = await this.userService.findById(id);
    checkExist(findUser);
    return findUser;
  }

  @Post('new')
  @UseGuards(JwtAuthGuard)
  public async createUser(
    @PUser() user: UserEntity,
    @Body() userDto: RegisterDto,
  ): Promise<UserEntity> {
    this.checkAdmin(user.role);
    return this.userService.createUser(userDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async deleteUser(
    @PUser() user: UserEntity,
    @Param('id') id: string,
  ): Promise<UserEntity> {
    this.checkAdmin(user.role);
    return this.userService.deleteUser(id);
  }

  public checkAdmin(role: UserEntity['role']) {
    if (role !== ERole.Admin) {
      throw new ForbiddenException();
    }
  }
}
