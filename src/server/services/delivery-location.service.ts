import { prisma } from "@/lib/prisma";

export class DeliveryLocationService {
  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.deliveryLocation.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.deliveryLocation.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findAllActive() {
    return prisma.deliveryLocation.findMany({
      where: { status: "ACTIVE" },
      orderBy: { deliveryLocation: "asc" },
    });
  }

  async create(data: { deliveryLocation: string }) {
    return prisma.deliveryLocation.create({ data });
  }

  async update(
    id: number,
    data: { deliveryLocation?: string; status?: "ACTIVE" | "INACTIVE" }
  ) {
    return prisma.deliveryLocation.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.deliveryLocation.delete({ where: { id } });
  }
}

export const deliveryLocationService = new DeliveryLocationService();
