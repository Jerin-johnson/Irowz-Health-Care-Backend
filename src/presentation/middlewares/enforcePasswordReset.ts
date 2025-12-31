import { NextFunction, Request, Response } from "express";

export const enforcePasswordReset = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  console.log("The user object is req.user", user);

  if (!user) return res.status(401).json({ message: "Unauthorized" });
  if (user.forcePasswordReset) {
    return res.status(403).json({
      message: "Password reset required before accessing this resource",
      code: "PASSWORD_RESET_REQUIRED",
    });
  }
  next();
};
