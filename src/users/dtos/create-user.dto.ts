import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    description: 'User email',
    format: 'email',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'User name',
    maxLength: 255,
  })
  name: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/, {
    message:
      'Password must contain at least 1 letter, 1 number, and 1 special character',
  })
  @ApiProperty({
    description: 'User password',
    minLength: 8,
    maxLength: 255,
  })
  password: string;
}
