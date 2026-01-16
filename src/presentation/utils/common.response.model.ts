import { Response } from "express";
import { HttpStatusCode } from "../../domain/constants/HttpStatusCode";

export class ApiResponse {
  static success(res: Response, data?: any, message = "Success", statusCode = HttpStatusCode.OK) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res: Response, message: string, statusCode: number, code?: string, errors?: any) {
    return res.status(statusCode).json({
      success: false,
      message,
      code,
      errors,
    });
  }
}
