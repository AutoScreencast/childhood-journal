import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type SeedUser = {
  username: string;
  name: string;
  addressAs: string;
  password: string | undefined;
  lang: string;
}

export const USERS: Array<SeedUser> = [
  {
    username: `tombowden`,
    name: `Tom`,
    addressAs: `Dad`,
    password: process.env.USER_PW_TOMBOWDEN,
    lang: `en`,
  },

  {
    username: `takakobowdenwatanabe`,
    name: `貴子`,
    addressAs: `お母さん`,
    password: process.env.USER_PW_TAKAKOBOWDENWATANABE,
    lang: `ja`,
  },

  {
    username: `takahidewatanabe`,
    name: `隆英`,
    addressAs: `おじいちゃん`,
    password: process.env.USER_PW_TAKAHIDEWATANABE,
    lang: `ja`,
  },

  {
    username: `eikowatanabe`,
    name: `栄子`,
    addressAs: `おばあちゃん`,
    password: process.env.USER_PW_EIKOWATANABE,
    lang: `ja`,
  },

  {
    username: `reikowatanabe`,
    name: `玲子`,
    addressAs: `おばちゃん`,
    password: process.env.USER_PW_REIKOWATANABE,
    lang: `ja`,
  },

  {
    username: `heddapfeiffer`,
    name: `Hedda`,
    addressAs: `Grandma`,
    password: process.env.USER_PW_HEDDAPFEIFFER,
    lang: `en`,
  },

  {
    username: `kellybowden`,
    name: `Kelly`,
    addressAs: `Uncle Kelly`,
    password: process.env.USER_PW_KELLYBOWDEN,
    lang: `en`,
  },

  {
    username: `robertbowden`,
    name: `Robert`,
    addressAs: `Grandad`,
    password: process.env.USER_PW_ROBERTBOWDEN,
    lang: `en`,
  },

  {
    username: `karlcahill`,
    name: `Karl`,
    addressAs: `Karl`,
    password: process.env.USER_PW_KARLCAHILL,
    lang: `en`,
  },

  {
    username: `leshorton`,
    name: `Les`,
    addressAs: `Les`,
    password: process.env.USER_PW_LESHORTON,
    lang: `en`,
  },

  {
    username: `willsjahrial`,
    name: `Will`,
    addressAs: `Will`,
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
          addressAs: user.addressAs,
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
