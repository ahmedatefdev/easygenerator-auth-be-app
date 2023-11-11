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
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
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
import { SignInDto } from './dtos/signInDto';

@Controller('auth')
@Serialize(UserDto)
@ApiTags('Authentication')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the authenticated user.',
    type: UserDto,
  })
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Get('/logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'Logout Success' })
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
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a new user.',
    type: UserDto,
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User details for signup',
  })
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(
      body.email,
      body.password,
      body.name,
    );
    return user;
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'Sign In Successful' })
  @ApiBody({
    type: SignInDto,
    description: 'User details for signin',
  })
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDto,
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return user details by ID.',
    type: UserDto,
  })
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
