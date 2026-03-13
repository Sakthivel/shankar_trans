import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const owner = await prisma.user.upsert({
    where: { userId: "owner" },
    update: {},
    create: {
      userId: "owner",
      password: hashedPassword,
      name: "System Owner",
      email: "owner@shankartrans.com",
      role: "OWNER",
      status: "ACTIVE",
    },
  });
  console.log("Owner user created/exists:", owner.userId);

  const manager = await prisma.user.upsert({
    where: { userId: "manager" },
    update: {},
    create: {
      userId: "manager",
      password: hashedPassword,
      name: "Manager User",
      email: "manager@shankartrans.com",
      role: "MANAGER",
      status: "ACTIVE",
    },
  });
  console.log("Manager user created/exists:", manager.userId);

  const staff = await prisma.user.upsert({
    where: { userId: "staff" },
    update: {},
    create: {
      userId: "staff",
      password: hashedPassword,
      name: "Staff User",
      email: "staff@shankartrans.com",
      role: "STAFF",
      status: "ACTIVE",
    },
  });
  console.log("Staff user created/exists:", staff.userId);

  console.log("\nDefault credentials for all users:");
  console.log("Password: admin123");
  console.log("\nUser IDs: owner, manager, staff");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
