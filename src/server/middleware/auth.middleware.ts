import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/lib/auth-utils";
import type { JwtPayload } from "@/types";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token =
    req.cookies?.accessToken ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ success: false, error: "Authentication required" });
    return;
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}
