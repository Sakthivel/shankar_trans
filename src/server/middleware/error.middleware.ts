import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("API Error:", err.constructor.name, err.message);
  if ("code" in err) console.error("Error code:", (err as { code: string }).code);

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
          error: `Database error (${err.code})`,
        });
        return;
    }
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    console.error("Prisma init error:", err.message);
    res.status(503).json({
      success: false,
      error: "Database connection failed",
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    console.error("Prisma validation:", err.message);
    res.status(400).json({
      success: false,
      error: "Invalid query parameters",
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
  });
}
