import { prisma } from "@/lib/prisma";

export class DriverService {
  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.driver.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.driver.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findAllActive() {
    return prisma.driver.findMany({
      where: { status: "ACTIVE" },
      orderBy: { driverName: "asc" },
    });
  }

  async create(data: { driverName: string; mobileNumber: string }) {
    return prisma.driver.create({ data });
  }

  async update(
    id: number,
    data: { driverName?: string; mobileNumber?: string; status?: "ACTIVE" | "INACTIVE" }
  ) {
    return prisma.driver.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.driver.update({ where: { id }, data: { status: "INACTIVE" } });
  }
}

export const driverService = new DriverService();
