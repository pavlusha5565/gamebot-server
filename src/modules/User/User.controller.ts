import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { checkExist } from 'src/utils/exeptions';
import { IPaginateInput } from 'src/utils/query/pagination';
import { AuthenticationService } from './Authentication.service';
import { INewUserInput } from './User.interfaces';
import { UserService } from './User.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthenticationService,
  ) {}

  @Get('all')
  async findAll(@Body() paginate: IPaginateInput) {
    return this.userService.findAllPaginate(paginate);
  }

  @Get(':id')
  async findUser(@Param('id') id: string) {
    const user = this.userService.findById(id);
    checkExist(user);
    return user;
  }

  @Post('new')
  async addUser(@Body() data: INewUserInput) {
    return this.authService.register({
      ...data,
      username: null,
    });
  }
}
