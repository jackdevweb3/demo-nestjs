import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "../base/auth/decorator/JwtAuthGuard";

import { AllowAnonymous } from "../base/auth/decorator/AllowAnonymous";
import { AuthService } from "./auth.service";
import { AuthorizedUser } from "./AuthorizedUser";
import { BaseResponse } from "../base/response/BaseResponse";
import { LoginPayload } from "./model/LoginPayLoad";
import { GlobalConstants } from "../config/global.constants";


@Controller("auth")
@ApiTags("auth")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(
    private readonly user: AuthorizedUser,
    private readonly service: AuthService,
  ) { }

  @Post("/login")
  @AllowAnonymous()
  @HttpCode(HttpStatus.OK)
  public async login(@Body() payload: LoginPayload) {
    if (!payload.account) {
      return BaseResponse.fail("no account");
    }
  
    const result = await this.service.login(payload);
    return BaseResponse.success(result);
  }

  @Get("/me")
  @HttpCode(HttpStatus.OK)
  public async me() {
    const user = this.user.get();
    return BaseResponse.success({
      account: user.account,
      extraInfo: user.extraInfo,
    });
  }
}
