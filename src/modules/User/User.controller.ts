import {
  Body,
  Controller,
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
import { JwtRefreshGuard } from '../Auth/guard/jwt-refresh.guard';
import { User } from './User.decorator';
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
    @Body() paginate: IPaginateInput,
    @User() user: UserEntity,
  ) {
    console.log(user);

    return this.userService.findAll(paginate);
  }

  @Get(':id')
  @UseGuards(JwtRefreshGuard)
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    checkExist(user);
    return user;
  }

  @Post('new')
  async createUser(@Body() userDto: RegisterDto): Promise<UserEntity> {
    console.log(userDto);
    return this.userService.createUser({ ...userDto, role: ERole.User });
  }
}
