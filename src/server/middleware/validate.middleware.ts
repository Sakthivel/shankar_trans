import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import * as z from "zod";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = z.ZodError ? (result as { error?: { issues?: { path: (string | number)[]; message: string }[] } }).error?.issues : [];
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: (issues || []).map((e: { path: (string | number)[]; message: string }) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
