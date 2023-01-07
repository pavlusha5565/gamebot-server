import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { checkExist } from 'src/utils/exeptions';
import { IPaginateInput } from 'src/utils/query/pagination';
import { AuthenticationService } from './Authentication.service';
import { INewUserInput } from './User.interfaces';
import { UserService } from './User.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly UserService: UserService,
    private readonly authService: AuthenticationService,
  ) {}

  @Get('all')
  async findAll(@Body() paginate: IPaginateInput) {
    return this.UserService.findAllPaginate(paginate);
  }

  @Get(':id')
  async findUser(@Param('id') id: string) {
    const user = this.UserService.findById(id);
    checkExist(user);
    return user;
  }

  @Post('new')
  async addUser(@Body() data: INewUserInput) {
    return this.authService.register({
      ...data,
      publicname: null,
      username: null,
    });
  }
}
