import { HttpStatusCode } from "axios";
import { AppError } from "./AppError";

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCode.BadRequest);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}
