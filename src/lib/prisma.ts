import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL || "";
  if (url.startsWith("prisma+postgres://") || url.includes("accelerate")) {
    return new PrismaClient({ accelerateUrl: url });
  }
  return new PrismaClient({ adapter: undefined as never });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
