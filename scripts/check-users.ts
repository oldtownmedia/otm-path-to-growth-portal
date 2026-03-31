import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const url = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, role: true, name: true, passwordHash: true },
  });
  console.log("Users:", JSON.stringify(users, null, 2));
  await prisma.$disconnect();
}

main().catch(console.error);
