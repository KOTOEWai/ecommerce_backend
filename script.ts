import { prisma } from "./lib/prisma";
import { hashPassword } from "./src/utils/hash";

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });

  const customerRole = await prisma.role.upsert({
    where: { name: "customer" },
    update: {},
    create: { name: "customer" },
  });

  const passwordHash = await hashPassword("Password@123");

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      name: "Admin User",
      phone: "0912345678",
      roleId: adminRole.id,
    },
    create: {
      name: "Admin User",
      email: "admin@example.com",
      phone: "0912345678",
      passwordHash,
      roleId: adminRole.id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      roleId: true,
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {
      name: "Customer User",
      phone: "0998765432",
      roleId: customerRole.id,
    },
    create: {
      name: "Customer User",
      email: "customer@example.com",
      phone: "0998765432",
      passwordHash,
      roleId: customerRole.id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      roleId: true,
    },
  });

  console.log("Seeded roles:", [adminRole.name, customerRole.name]);
  console.log("Seeded users:", [adminUser, customerUser]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
