import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  PASSWORD_REGEX,
  PASSWORD_MESSAGE,
  PASSWORD_MIN_LENGTH,
  NAME_MIN_LENGTH,
  NAME_MESSAGE,
  EMAIL_MESSAGE,
} from '@easyauth/shared';

export class SignupDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: EMAIL_MESSAGE })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(NAME_MIN_LENGTH, { message: NAME_MESSAGE })
  name: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, {
    message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  })
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MESSAGE })
  password: string;
}
