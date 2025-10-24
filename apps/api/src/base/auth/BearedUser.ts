import { ApiProperty } from '@nestjs/swagger';

export class BearedUser {
  @ApiProperty({ description: 'account' })
  account!: string;

  @ApiProperty({ description: 'extra info for user identity' })
  extraInfo!: string;


  @ApiProperty({ description: 'issue at time (seconds)' })
  iat?: number;

  @ApiProperty({ description: 'expiration at time (seconds)' })
  exp?: number;
}
