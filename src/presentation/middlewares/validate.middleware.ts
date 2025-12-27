import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = {
      body: req.body,
      file: req.file,
      files: req.files,
    };

    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.flatten(),
      });
    }
    const data = result.data as any;

    if (data.body) {
      req.body = data.body;
    }

    if (data.file) {
      req.file = data.file;
    }

    if (data.files) {
      req.files = data.files;
    }

    next();
  };
