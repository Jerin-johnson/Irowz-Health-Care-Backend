import winston, { Logger } from "winston";
import { ILogger, LogMeta } from "../../../domain/services/logger/ILogger";

export class WinstonLogger implements ILogger {
  private readonly logger: Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL ?? "error",

      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),

      transports: [
        // ONLY errors
        new winston.transports.File({
          filename: "logs/error.log",
          level: "error",
        }),

        //  everything (still filtered by level)
        new winston.transports.File({
          filename: "logs/combined.log",
        }),
      ],
    });

    if (process.env.NODE_ENV !== "production") {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        })
      );
    }
  }

  info(message: string, meta?: LogMeta): void {
    this.logger.info(message, meta);
  }

  warn(message: string, meta?: LogMeta): void {
    this.logger.warn(message, meta);
  }

  error(message: string, meta?: LogMeta): void {
    this.logger.error(message, meta);
  }

  debug(message: string, meta?: LogMeta): void {
    this.logger.debug(message, meta);
  }
}
