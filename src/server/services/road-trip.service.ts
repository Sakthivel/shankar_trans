import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const includeRelations = {
  vehicle: { select: { vehicleNumber: true } },
  driver: { select: { driverName: true } },
  loadingPlant: { select: { loadingPlant: true } },
  deliveryLocation: { select: { deliveryLocation: true } },
  approvedBy: { select: { name: true } },
};

export class RoadTripService {
  async findAll(
    page = 1,
    limit = 20,
    filters?: {
      month?: string;
      year?: string;
      vehicleId?: number;
      driverId?: number;
      tripId?: string;
    }
  ) {
    const skip = (page - 1) * limit;
    const where: Prisma.RoadTripWhereInput = {};
    if (filters?.month) where.month = filters.month;
    if (filters?.year) where.year = filters.year;
    if (filters?.vehicleId) where.vehicleId = filters.vehicleId;
    if (filters?.driverId) where.driverId = filters.driverId;
    if (filters?.tripId) where.tripId = { contains: filters.tripId, mode: "insensitive" };

    const [data, total] = await Promise.all([
      prisma.roadTrip.findMany({
        where,
        skip,
        take: limit,
        include: includeRelations,
        orderBy: { createdAt: "desc" },
      }),
      prisma.roadTrip.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: number) {
    return prisma.roadTrip.findUniqueOrThrow({
      where: { id },
      include: includeRelations,
    });
  }

  async create(data: Prisma.RoadTripCreateInput) {
    return prisma.roadTrip.create({ data, include: includeRelations });
  }

  async update(id: number, data: Prisma.RoadTripUpdateInput) {
    return prisma.roadTrip.update({
      where: { id },
      data,
      include: includeRelations,
    });
  }

  async approve(id: number, approvedById: number) {
    return prisma.roadTrip.update({
      where: { id },
      data: { approved: true, approvedBy: { connect: { id: approvedById } } },
      include: includeRelations,
    });
  }

  async updateDocUrl(id: number, docUploadUrl: string) {
    return prisma.roadTrip.update({
      where: { id },
      data: { docUploadUrl },
    });
  }

  async delete(id: number) {
    return prisma.roadTrip.delete({ where: { id } });
  }
}

export const roadTripService = new RoadTripService();
