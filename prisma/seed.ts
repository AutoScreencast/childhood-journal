import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { USERS } from "./secrets/users";

const prisma = new PrismaClient();

async function seed() {
  USERS.forEach(
    async (user) =>
      await prisma.user.create({
        data: {
          name: user.name,
          username: user.username,
          password: {
            create: {
              hash: await bcrypt.hash(user.password, 10),
            },
          },
        },
      })
  );

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
