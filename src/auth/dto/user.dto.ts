import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'sub',
    type: 'string',
    example: '1',
  })
  sub: string;

  @ApiProperty({
    description: 'username',
    type: 'string',
    example: 'dlyubovkiy@gmail.com',
  })
  username: string;
}
