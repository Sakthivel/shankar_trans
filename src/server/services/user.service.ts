import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-utils";
import type { Role, Status } from "@/types";

export class UserService {
  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async create(data: {
    userId: string;
    password: string;
    name: string;
    email: string;
    role: Role;
  }) {
    const hashed = await hashPassword(data.password);
    return prisma.user.create({
      data: { ...data, password: hashed },
      select: {
        id: true,
        userId: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });
  }

  async update(
    id: number,
    data: {
      name?: string;
      email?: string;
      role?: Role;
      status?: Status;
      password?: string;
    }
  ) {
    const updateData: Record<string, unknown> = { ...data };
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }
    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        userId: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });
  }

  async delete(id: number) {
    return prisma.user.delete({ where: { id } });
  }
}

export const userService = new UserService();
