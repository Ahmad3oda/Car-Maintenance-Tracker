import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  PASSWORD_MAX,
  PASSWORD_MESSAGES,
  PASSWORD_MIN,
  USERNAME_MAX,
  USERNAME_MESSAGES,
  USERNAME_MIN,
} from '../auth.rules';

export class RegisterDto {
  @ApiProperty({
    example: 'ahmed_92',
    minLength: USERNAME_MIN,
    maxLength: USERNAME_MAX,
  })
  @IsString()
  @Length(USERNAME_MIN, USERNAME_MAX, { message: USERNAME_MESSAGES.length })
  @Matches(/^[A-Za-z]/, { message: USERNAME_MESSAGES.start })
  @Matches(/^[A-Za-z0-9_]*$/, { message: USERNAME_MESSAGES.chars })
  username: string;

  @ApiProperty({ example: 'secret123', minLength: PASSWORD_MIN })
  @IsString()
  @MinLength(PASSWORD_MIN, { message: PASSWORD_MESSAGES.min })
  @MaxLength(PASSWORD_MAX, { message: PASSWORD_MESSAGES.max })
  password: string;
}
