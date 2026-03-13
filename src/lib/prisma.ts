import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL || "";

  if (!url) {
    console.error("DATABASE_URL is not set!");
  }

  if (url.startsWith("prisma+postgres://") || url.includes("accelerate")) {
    return new PrismaClient({ accelerateUrl: url });
  }

  const adapter = new PrismaPg({
    connectionString: url,
    ssl: url.includes("sslmode=require") || url.includes("prisma.io")
      ? { rejectUnauthorized: false }
      : undefined,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
