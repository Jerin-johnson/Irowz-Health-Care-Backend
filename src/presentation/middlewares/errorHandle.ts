import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("hai", err);

  res.status(400).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};
