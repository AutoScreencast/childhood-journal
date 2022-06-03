import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type SeedUser = {
  username: string;
  name: string;
  password: string | undefined;
  lang: string;
}

export const USERS: Array<SeedUser> = [
  {
    username: `tombowden`,
    name: `Tom`,
    password: process.env.USER_PW_TOMBOWDEN,
    lang: `en`,
  },

  {
    username: `takakobowdenwatanabe`,
    name: `貴子`,
    password: process.env.USER_PW_TAKAKOBOWDENWATANABE,
    lang: `ja`,
  },

  {
    username: `takahidewatanabe`,
    name: `Takahide`,
    password: process.env.USER_PW_TAKAHIDEWATANABE,
    lang: `ja`,
  },

  {
    username: `eikowatanabe`,
    name: `Eiko`,
    password: process.env.USER_PW_EIKOWATANABE,
    lang: `ja`,
  },

  {
    username: `reikowatanabe`,
    name: `Reiko`,
    password: process.env.USER_PW_REIKOWATANABE,
    lang: `ja`,
  },

  {
    username: `heddapfeiffer`,
    name: `Hedda`,
    password: process.env.USER_PW_HEDDAPFEIFFER,
    lang: `en`,
  },

  {
    username: `kellybowden`,
    name: `Kelly`,
    password: process.env.USER_PW_KELLYBOWDEN,
    lang: `en`,
  },

  {
    username: `robertbowden`,
    name: `Robert`,
    password: process.env.USER_PW_ROBERTBOWDEN,
    lang: `en`,
  },

  {
    username: `karlcahill`,
    name: `Karl`,
    password: process.env.USER_PW_KARLCAHILL,
    lang: `en`,
  },

  {
    username: `leshorton`,
    name: `Les`,
    password: process.env.USER_PW_LESHORTON,
    lang: `en`,
  },

  {
    username: `willsjahrial`,
    name: `Will`,
    password: process.env.USER_PW_WILLSJAHRIAL,
    lang: `en`,
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
          lang: user.lang,
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
