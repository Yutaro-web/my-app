import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ["query"],
});

async function main() {
  await prisma.user.create({
    data: {
      name: `新しいユーザー ${new Date().toISOString()}`,
    },
  });

  const users = await prisma.user.findMany();

  console.log("ユーザー一覧:", users);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

