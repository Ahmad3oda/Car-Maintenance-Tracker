import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty() id: number;
  @ApiProperty() username: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT; send as "Authorization: Bearer <token>"' })
  accessToken: string;

  @ApiProperty({ description: 'Token lifetime in seconds' })
  expiresIn: number;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}
