import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { jwtTokenService } from "../../DI/service";
import { HttpStatusCode } from "../../domain/constants/HttpStatusCode";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("auth middleware", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const payload = jwtTokenService.verifyAccessToken(token) as JwtPayload & {
      userId: string;
      role: string;
    };

    req.user = {
      userId: payload.userId,
      role: payload.role,
    };
    if (payload.hosptialId) {
      req.user.hospitalId = payload.hosptialId;
    }
    if (payload.patientId) {
      req.user.patientId = payload.patientId;
    }

    if (payload.doctorId) {
      req.user.doctorId = payload.doctorId;
    }

    if (payload.forcePasswordReset) {
      req.user.forcePasswordReset = payload.forcePasswordReset;
    }

    console.log(req.user);
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
