import { prisma } from "~/db.server";

export type { Post } from "@prisma/client";

export async function getPosts() {
  return prisma.post.findMany();
}

export async function getPost(dateSlug: string) {
  return prisma.post.findUnique({ where: { dateSlug } });
}
