import { ApiProperty } from "@nestjs/swagger";

export enum BaseResponseResultCode {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}
export class BaseResponse<T = object> {
  @ApiProperty()
  result: boolean = true; //Operate succcess or fail

  @ApiProperty()
  resultCode: string = BaseResponseResultCode.SUCCESS; //result code

  @ApiProperty()
  message: string = "success"; //result string

  @ApiProperty()
  data: T; //Json result

  constructor(data?: T) {
    this.data = data;
  }

  public static success<T>(data?: T, message?: string, resultCode?: string) {
    return new BaseResponse(data)
      .setMessage(message || "success")
      .setResultCode(resultCode || BaseResponseResultCode.SUCCESS)
      .setResult(true);
  }
  public static fail<T>(data?: T, message?: string, resultCode?: string) {
    return new BaseResponse(data)
      .setMessage(message || "fail")
      .setResultCode(resultCode || BaseResponseResultCode.FAILURE)
      .setResult(false);
  }
  setData(data: T) {
    this.data = data;
    return this;
  }
  setMessage(message: string) {
    this.message = message;
    return this;
  }

  setResult(result: boolean) {
    this.result = result;
    return this;
  }

  setResultCode(resultCode: string) {
    this.resultCode = resultCode;
    return this;
  }
}
