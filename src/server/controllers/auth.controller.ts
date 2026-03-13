import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, password } = req.body;
      const result = await authService.login(userId, password);

      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ success: true, data: result.user });
    } catch (err) {
      if (err instanceof Error && err.message === "Invalid credentials") {
        res.status(401).json({ success: false, error: err.message });
        return;
      }
      next(err);
    }
  }

  async logout(_req: Request, res: Response) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ success: true, message: "Logged out" });
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getMe(req.user!.id);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
