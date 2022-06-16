import type { Post } from "@prisma/client";
import {
  differenceInCalendarDays,
  format,
  formatISO,
  parseISO,
} from "date-fns";

import { prisma } from "~/db.server";
import { BIRTHDATE } from "~/secrets/constants";

export type { Post } from "@prisma/client";

export interface AugmentedPost extends Post {
  daysSinceBirth: number;
  formattedDate: string;
}

const birthdate = parseISO(BIRTHDATE);

export async function getPosts() {
  const posts = await prisma.post.findMany();
  return posts.map((post) => {
    const postDate = parseISO(post.dateSlug);
    return {
      dateSlug: post.dateSlug,
      title: post.title,
      featuredImage: post.featuredImage,
      markdown: post.markdown,
      daysSinceBirth: differenceInCalendarDays(postDate, birthdate),
      formattedDate: format(postDate, "EEEE, LLLL do, y"), // e.g. "Wednesday, May 25th, 2022"
    };
  });
}

export async function getPostsSortedByDescendingDate() {
  const posts = await prisma.post.findMany({
    orderBy: {
      dateSlug: "desc",
    },
  });
  return posts.map((post) => {
    const postDate = parseISO(post.dateSlug);
    return {
      dateSlug: post.dateSlug,
      title: post.title,
      featuredImage: post.featuredImage,
      markdown: post.markdown,
      daysSinceBirth: differenceInCalendarDays(postDate, birthdate),
      formattedDate: format(postDate, "EEEE, LLLL do, y"), // e.g. "Wednesday, May 25th, 2022"
    };
  });
}

export async function getPostsSinceBeginningOfLastMonthSortedByDescendingDate() {
  const today = new Date();
  const prevMonth = today.getMonth() - 1;
  const firstDayOfMonth = 1;
  // Because of how dates work in JavaScript, the value of the year gets rolled back if we subtract 1 month from January.
  const firstDayPreviousMonth = new Date(
    today.getFullYear(),
    prevMonth,
    firstDayOfMonth
  );
  const dateSlugOfFirstDayPreviousMonth = formatISO(firstDayPreviousMonth, {
    representation: "date",
  }); // to get date string in format "YYYY-MM-DD"
  const posts = await prisma.post.findMany({
    // take: 10,
    orderBy: {
      dateSlug: "desc",
    },
    where: {
      dateSlug: {
        gte: dateSlugOfFirstDayPreviousMonth,
      },
    },
  });
  return posts.map((post) => {
    const postDate = parseISO(post.dateSlug);
    return {
      dateSlug: post.dateSlug,
      title: post.title,
      featuredImage: post.featuredImage,
      markdown: post.markdown,
      daysSinceBirth: differenceInCalendarDays(postDate, birthdate),
      formattedDate: format(postDate, "EEEE, LLLL do, y"), // e.g. "Wednesday, May 25th, 2022"
    };
  });
}

export async function getPost(dateSlug: string) {
  return prisma.post.findUnique({ where: { dateSlug } });
}
