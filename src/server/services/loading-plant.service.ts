import { prisma } from "@/lib/prisma";

export class LoadingPlantService {
  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.loadingPlant.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.loadingPlant.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findAllActive() {
    return prisma.loadingPlant.findMany({
      where: { status: "ACTIVE" },
      orderBy: { loadingPlant: "asc" },
    });
  }

  async create(data: { loadingPlant: string }) {
    return prisma.loadingPlant.create({ data });
  }

  async update(
    id: number,
    data: { loadingPlant?: string; status?: "ACTIVE" | "INACTIVE" }
  ) {
    return prisma.loadingPlant.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.loadingPlant.update({ where: { id }, data: { status: "INACTIVE" } });
  }
}

export const loadingPlantService = new LoadingPlantService();
