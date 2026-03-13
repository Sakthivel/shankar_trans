import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const includeRelations = {
  vehicle: { select: { vehicleNumber: true } },
  driver: { select: { driverName: true } },
  loadingPlant: { select: { loadingPlant: true } },
  deliveryLocation: { select: { deliveryLocation: true } },
  approvedBy: { select: { name: true } },
};

export class LpgTankerService {
  async findAll(
    page = 1,
    limit = 20,
    filters?: { month?: string; year?: string; vehicleId?: number; driverId?: number }
  ) {
    const skip = (page - 1) * limit;
    const where: Prisma.LpgTankerWhereInput = {};
    if (filters?.month) where.month = filters.month;
    if (filters?.year) where.year = filters.year;
    if (filters?.vehicleId) where.vehicleId = filters.vehicleId;
    if (filters?.driverId) where.driverId = filters.driverId;

    const [data, total] = await Promise.all([
      prisma.lpgTanker.findMany({
        where,
        skip,
        take: limit,
        include: includeRelations,
        orderBy: { createdAt: "desc" },
      }),
      prisma.lpgTanker.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: number) {
    return prisma.lpgTanker.findUniqueOrThrow({
      where: { id },
      include: includeRelations,
    });
  }

  async create(data: Prisma.LpgTankerCreateInput) {
    return prisma.lpgTanker.create({ data, include: includeRelations });
  }

  async update(id: number, data: Prisma.LpgTankerUpdateInput) {
    return prisma.lpgTanker.update({
      where: { id },
      data,
      include: includeRelations,
    });
  }

  async approve(id: number, approvedById: number) {
    return prisma.lpgTanker.update({
      where: { id },
      data: { approved: true, approvedBy: { connect: { id: approvedById } } },
      include: includeRelations,
    });
  }

  async delete(id: number) {
    return prisma.lpgTanker.delete({ where: { id } });
  }
}

export const lpgTankerService = new LpgTankerService();
