import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { BaseResponse } from './base/response/BaseResponse';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/')
  async checkStatus() {
    const result = await this.appService.checkStatus();
    return BaseResponse.success(result);
  }
}
