import { ApiProperty } from "@nestjs/swagger";

export class LoginPayload {
  @ApiProperty({ required: true })
  account: string;
}
