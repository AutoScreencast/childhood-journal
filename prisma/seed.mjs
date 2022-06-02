import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const USERS = [
  {
    username: `tombowden`,
    name: `Tom`,
    password: process.env.USER_PW_TOMBOWDEN,
  },

  {
    username: `takakobowdenwatanabe`,
    name: `Takako`,
    password: process.env.USER_PW_TAKAKOBOWDENWATANABE,
  },

  {
    username: `takahidewatanabe`,
    name: `Takahide`,
    password: process.env.USER_PW_TAKAHIDEWATANABE,
  },

  {
    username: `eikowatanabe`,
    name: `Eiko`,
    password: process.env.USER_PW_EIKOWATANABE,
  },

  {
    username: `reikowatanabe`,
    name: `Reiko`,
    password: process.env.USER_PW_REIKOWATANABE,
  },

  {
    username: `heddapfeiffer`,
    name: `Hedda`,
    password: process.env.USER_PW_HEDDAPFEIFFER,
  },

  {
    username: `kellybowden`,
    name: `Kelly`,
    password: process.env.USER_PW_KELLYBOWDEN,
  },

  {
    username: `robertbowden`,
    name: `Robert`,
    password: process.env.USER_PW_ROBERTBOWDEN,
  },

  {
    username: `karlcahill`,
    name: `Karl`,
    password: process.env.USER_PW_KARLCAHILL,
  },

  {
    username: `leshorton`,
    name: `Les`,
    password: process.env.USER_PW_LESHORTON,
  },

  {
    username: `willsjahrial`,
    name: `Will`,
    password: process.env.USER_PW_WILLSJAHRIAL,
  },
];

async function seed() {
  console.log(`Attempting to seed the database...`);

  USERS.forEach(async (user) => {
    if (!user.password) throw `Password is not set for seed user: ${user.name}`;
    try {
      const seededUser = await prisma.user.create({
        data: {
          name: user.name,
          username: user.username,
          password: {
            create: {
              hash: await bcrypt.hash(user.password, 10),
            },
          },
        },
      });
      console.log("Seeded user with username:", seededUser.username);
    } catch (error) {
      console.error(error);
    }
  });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
