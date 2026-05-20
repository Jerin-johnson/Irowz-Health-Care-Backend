import { Request, Response, NextFunction } from "express";
import { WinstonLogger } from "../../infrastructure/services/logger/WinstonLogger";
import { AppError } from "../../domain/errors/AppError";
import { HttpStatusCode } from "../../domain/constants/HttpStatusCode";

const logger = new WinstonLogger();

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error("Unhandled application error", {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || "An unexpected error occurred. Please try again later.",
  });
};
