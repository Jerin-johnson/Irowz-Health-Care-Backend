import winston, { Logger } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { ILogger, LogMeta } from "../../../domain/services/logger/ILogger";

export class WinstonLogger implements ILogger {
  private readonly logger: Logger;

  constructor() {
    const fileFormat = winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.errors({ stack: true }),
      winston.format.json()
    );

    const errorTransport = new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxFiles: "14d", // retention = 14 days
      zippedArchive: true,
    });

    const combinedTransport = new DailyRotateFile({
      filename: "logs/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d", // retention = 14 days
      zippedArchive: true,
    });

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL ?? "info",
      format: fileFormat,
      transports: [errorTransport, combinedTransport],
    });

    if (process.env.NODE_ENV !== "production") {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        })
      );
    }
  }

  info(message: string, meta?: LogMeta) {
    this.logger.info(message, meta);
  }

  warn(message: string, meta?: LogMeta) {
    this.logger.warn(message, meta);
  }

  error(message: string, meta?: LogMeta) {
    this.logger.error(message, meta);
  }

  debug(message: string, meta?: LogMeta) {
    this.logger.debug(message, meta);
  }
}
