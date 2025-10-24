import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';



import { CryptoService } from './crypto.service';
import { BaseResponse } from '../base/response/BaseResponse';

@Controller('crypto')
@ApiTags('crypto')
export class CryptoController {
  constructor(
    private readonly service: CryptoService,
  ) { }

  @Get('/es256')
  @HttpCode(HttpStatus.OK)
  public async es256() {
    const result = this.service.es256();
    return BaseResponse.success(result);
  }

}
