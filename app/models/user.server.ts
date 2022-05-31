import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import omit from "lodash.omit";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

async function getAllUsers() {
  return await prisma.user.findMany({
    include: {
      password: true,
    },
  });
}

export async function verifyLogin(password: Password["hash"]) {
  const users = await getAllUsers();

  let validatedUser: User | null = null;

  // TODO: check performance
  for (const user of users) {
    if (!user || !user.password) return null;
    const isValid = await bcrypt.compare(password, user.password.hash);

    if (isValid) {
      validatedUser = omit(user, "password");
    }
  }

  return validatedUser;
}
