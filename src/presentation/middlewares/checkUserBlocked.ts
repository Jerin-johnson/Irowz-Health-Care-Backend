import { Request, Response, NextFunction } from "express";
import User from "../../infrastructure/database/mongo/models/User.model";

export const checkUserBlocked = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId).select("isBlocked");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isBlocked) {
      res.clearCookie("refreshToken");
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
