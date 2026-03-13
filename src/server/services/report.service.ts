import { prisma } from "@/lib/prisma";

export class ReportService {
  async generateReport(filters: {
    type: "lpg-tanker" | "contract-vehicle" | "road-trip";
    vehicleId?: number;
    driverId?: number;
    tripId?: string;
    month?: string;
    year?: string;
  }) {
    const where: Record<string, unknown> = {};
    if (filters.vehicleId) where.vehicleId = filters.vehicleId;
    if (filters.driverId) where.driverId = filters.driverId;
    if (filters.month) where.month = filters.month;
    if (filters.year) where.year = filters.year;
    if (filters.tripId) where.tripId = { contains: filters.tripId, mode: "insensitive" };

    const include = {
      vehicle: { select: { vehicleNumber: true } },
      driver: { select: { driverName: true } },
      approvedBy: { select: { name: true } },
    };

    switch (filters.type) {
      case "lpg-tanker":
        return prisma.lpgTanker.findMany({
          where,
          include: {
            ...include,
            loadingPlant: { select: { loadingPlant: true } },
            deliveryLocation: { select: { deliveryLocation: true } },
          },
          orderBy: { date: "desc" },
        });
      case "contract-vehicle":
        return prisma.contractVehicle.findMany({
          where,
          include,
          orderBy: { date: "desc" },
        });
      case "road-trip":
        return prisma.roadTrip.findMany({
          where,
          include: {
            ...include,
            loadingPlant: { select: { loadingPlant: true } },
            deliveryLocation: { select: { deliveryLocation: true } },
          },
          orderBy: { date: "desc" },
        });
    }
  }
}

export const reportService = new ReportService();
