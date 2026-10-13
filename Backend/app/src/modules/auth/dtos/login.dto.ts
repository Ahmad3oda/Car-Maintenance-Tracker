import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/** Login checks credentials only; format rules apply at registration. */
export class LoginDto {
  @ApiProperty({ example: 'ahmed_92' })
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @ApiProperty({ example: 'secret123' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
