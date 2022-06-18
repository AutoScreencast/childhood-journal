import type { Post } from "@prisma/client";
import {
  differenceInCalendarDays,
  format,
  formatISO,
  parseISO,
} from "date-fns";
import head from "lodash.head";
import invariant from "tiny-invariant";

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

export async function getPostsChunkedByMonth() {
  const posts = await prisma.post.findMany({
    take: 60, // getting all of the 800+ posts is too much...
    orderBy: {
      dateSlug: "desc",
    },
  });

  type Accumulator = Record<
    string,
    Array<Omit<AugmentedPost, "createdAt" | "updatedAt">>
  >;
  const postsGroupedByMonth = posts.reduce(
    (accumulator: Accumulator, post: Post) => {
      // want to get [ [2020-01-20, 20-01-21, ...], ..., [2022-05-01, 2022-05-02, ...]]
      // start with {"2020-01": [2020-01-20, 20-01-21, ...], ..., "2022-05": [2022-05-01, 2022-05-02, ...]}
      const dateStr = post.dateSlug; // eg. "2020-01-20"
      const yearAndMonthStr = dateStr.substring(0, 7); // gets "2020-01"
      const postDate = parseISO(dateStr);

      accumulator[yearAndMonthStr] = [
        ...(accumulator[yearAndMonthStr]?.length > 0
          ? accumulator[yearAndMonthStr]
          : []),
        {
          dateSlug: post.dateSlug,
          title: post.title,
          featuredImage: post.featuredImage,
          markdown: post.markdown,
          daysSinceBirth: differenceInCalendarDays(postDate, birthdate),
          formattedDate: format(postDate, "EEEE, LLLL do, y"), // e.g. "Wednesday, May 25th, 2022"
        },
      ];

      return accumulator;
    },
    {}
  );

  return postsGroupedByMonth;
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

export async function getPostsSinceBeginningOfPreviousMonthSortedByDescendingDate() {
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

export async function getPostsSinceBeginningOfMonthOfLastPostDateSortedByDescendingDate() {
  const postsArrayContainingLatestPostOnly = await prisma.post.findMany({
    take: 1,
    orderBy: {
      dateSlug: "desc",
    },
  });
  invariant(
    head(postsArrayContainingLatestPostOnly),
    "No posts returned from getPostsSinceBeginningOfMonthOfLastPostDateSortedByDescendingDate"
  );
  const dateOfLatestPost = new Date(
    head(postsArrayContainingLatestPostOnly)!.dateSlug
  );
  const prevMonth = dateOfLatestPost.getMonth();
  const firstDayOfMonth = 1;
  // Because of how dates work in JavaScript, the value of the year gets rolled back if we subtract 1 month from January.
  const firstDayPreviousMonth = new Date(
    dateOfLatestPost.getFullYear(),
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

export async function getPostsSinceBeginningOfMonthPreviousToLastPostDateSortedByDescendingDate() {
  const postsArrayContainingLatestPostOnly = await prisma.post.findMany({
    take: 1,
    orderBy: {
      dateSlug: "desc",
    },
  });
  invariant(
    head(postsArrayContainingLatestPostOnly),
    "No posts returned from getPostsSinceBeginningOfMonthPreviousToLastPostDateSortedByDescendingDate"
  );
  const dateOfLatestPost = new Date(
    head(postsArrayContainingLatestPostOnly)!.dateSlug
  );
  const prevMonth = dateOfLatestPost.getMonth() - 1;
  const firstDayOfMonth = 1;
  // Because of how dates work in JavaScript, the value of the year gets rolled back if we subtract 1 month from January.
  const firstDayPreviousMonth = new Date(
    dateOfLatestPost.getFullYear(),
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
