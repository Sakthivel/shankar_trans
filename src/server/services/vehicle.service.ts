import { prisma } from "@/lib/prisma";

export class VehicleService {
  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.vehicle.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.vehicle.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findAllActive() {
    return prisma.vehicle.findMany({
      where: { status: "ACTIVE" },
      orderBy: { vehicleNumber: "asc" },
    });
  }

  async create(data: { vehicleNumber: string }) {
    return prisma.vehicle.create({ data });
  }

  async update(
    id: number,
    data: { vehicleNumber?: string; status?: "ACTIVE" | "INACTIVE" }
  ) {
    return prisma.vehicle.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.vehicle.update({ where: { id }, data: { status: "INACTIVE" } });
  }
}

export const vehicleService = new VehicleService();
