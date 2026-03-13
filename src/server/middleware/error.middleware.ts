import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("API Error:", err.message);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        res.status(409).json({
          success: false,
          error: "A record with this value already exists",
        });
        return;
      case "P2025":
        res.status(404).json({
          success: false,
          error: "Record not found",
        });
        return;
      default:
        res.status(400).json({
          success: false,
          error: "Database error",
        });
        return;
    }
  }

  res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
}
