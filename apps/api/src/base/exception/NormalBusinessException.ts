import { HttpException, HttpStatus } from "@nestjs/common";
import { BaseResponse } from "../response/BaseResponse";

export class NormalBusinessException extends HttpException {
  private resultCode: string;
  constructor(
    resultCode: string,
    response: string | { message: string; data?: any },
  ) {
    super(response, HttpStatus.OK, undefined);
    this.resultCode = resultCode;
  }

  getStatus(): number {
    return HttpStatus.OK;
  }

  getResponseBody() {
    const response = this.getResponse();
    if (typeof response == "string") {
      return new BaseResponse(undefined)
        .setResult(false)
        .setResultCode(this.resultCode)
        .setMessage(response);
    } else {
      return new BaseResponse(response["data"])
        .setResult(false)
        .setResultCode(this.resultCode)
        .setMessage(response["message"] ?? "");
    }
  }
}
