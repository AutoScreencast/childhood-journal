import { differenceInCalendarDays, format, parseISO } from "date-fns";

import { prisma } from "~/db.server";
import { BIRTHDATE } from "~/secrets/constants";

export type { Post } from "@prisma/client";


const birthdate = parseISO(BIRTHDATE);

export async function getPosts() {
  const posts = await prisma.post.findMany();
  return posts.map(post => {
    const postDate = parseISO(post.dateSlug);
    return {
      dateSlug: post.dateSlug,
      title: post.title,
      featuredImage: post.featuredImage,
      markdown: post.markdown,
      daysSinceBirth: differenceInCalendarDays(postDate, birthdate),
      formattedDate: format(postDate, "EEEE, LLLL do, y"), // e.g. "Wednesday, May 25th, 2022"
    }
  });
}

export async function getPostsSortedByDescendingDate() {
  const posts = await prisma.post.findMany({
    orderBy: {
      dateSlug: 'desc',
    },
  });
  return posts.map(post => {
    const postDate = parseISO(post.dateSlug);
    return {
      dateSlug: post.dateSlug,
      title: post.title,
      featuredImage: post.featuredImage,
      markdown: post.markdown,
      daysSinceBirth: differenceInCalendarDays(postDate, birthdate),
      formattedDate: format(postDate, "EEEE, LLLL do, y"), // e.g. "Wednesday, May 25th, 2022"
    }
  });
}

export async function getPost(dateSlug: string) {
  return prisma.post.findUnique({ where: { dateSlug } });
}

function compareDates(date1: string, date2: string) {
  const d1 = new Date(date1); 
  const d2 = new Date(date2);

  let same = d1.getTime() === d2.getTime();
  if (same) return 0;
  if (d1 > d2) return 1;
  return -1;
}
