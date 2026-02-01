import { Request, Response, NextFunction } from "express";
import { WinstonLogger } from "../../infrastructure/services/logger/WinstonLogger";

const logger = new WinstonLogger();

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  logger.error("Unhandled application error", {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
  });

  return res.status(400).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};
