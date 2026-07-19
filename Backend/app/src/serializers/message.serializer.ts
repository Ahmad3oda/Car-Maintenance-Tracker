import { ApiProperty } from '@nestjs/swagger';

export class MessageSerializer {
  @ApiProperty({ description: 'Message', example: 'Message' })
  message: string;
}
