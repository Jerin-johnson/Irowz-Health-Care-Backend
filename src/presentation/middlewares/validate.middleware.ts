import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      // query: req.query,
      // params: req.params,
    });

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.flatten(),
      });
    }

    const data = result.data as any;

    req.body = data.body ?? req.body;
    // req.query = data.query ?? req.query;
    // req.params = data.params ?? req.params;

    next();
  };
