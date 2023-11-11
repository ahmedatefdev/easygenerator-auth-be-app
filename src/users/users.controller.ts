import {
  Body,
  Controller,
  Post,
  Get,
  HttpStatus,
  Param,
  NotFoundException,
  UseGuards,
  Res,
  HttpCode,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { AuthValidId } from 'src/guards/authValidId.guard';
import { Response } from 'express';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }
  @Get('/logout')
  @UseGuards(AuthGuard)
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('accessToken', '', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 0,
    });
    return 'Logout Success';
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(
      body.email,
      body.password,
      body.name,
    );
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: any,
  ) {
    const accessToken = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return 'Done';
  }

  @Get('/:id')
  @UseGuards(AuthValidId)
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
}
