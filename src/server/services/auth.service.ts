import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/auth-utils";
import type { JwtPayload } from "@/types";

export class AuthService {
  async login(userId: string, password: string) {
    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user || user.status === "INACTIVE") {
      throw new Error("Invalid credentials");
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const payload: JwtPayload = {
      id: user.id,
      userId: user.userId,
      role: user.role,
    };

    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
      user: {
        id: user.id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getMe(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });
    if (!user) throw new Error("User not found");
    return user;
  }
}

export const authService = new AuthService();
