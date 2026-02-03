import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EMAIL_MESSAGE } from '@easyauth/shared';

export class SigninDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: EMAIL_MESSAGE })
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password: string;
}
