import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getPosts } from "~/models/post.server";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPosts>>;
};

export const loader = async () => {
  return json<LoaderData>({
    posts: await getPosts(),
  });
};

export default function Posts() {
  const { posts } = useLoaderData<LoaderData>();
  return (
    <main>
      <h1>Posts</h1>
      <ul>
        {posts
          .sort((a, b) => compareDates(a.dateSlug, b.dateSlug))
          .map((post) => (
          <li key={post.dateSlug}>
            <Link
              to={post.dateSlug}
              className="text-blue-600 underline"
            >
              {post.title} - {post.dateSlug}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

/** 
 * Compares two Date objects and returns a number value that represents 
 * the result:
 * 0 if the two dates are equal.
 * 1 if the first date is greater than second.
 * -1 if the first date is less than second.
 * @param date1 First date object to compare.
 * @param date2 Second date object to compare.
 */
function compareDates(date1: string, date2: string): number
 {
   const d1 = new Date(date1); 
   const d2 = new Date(date2);
 
   // Check if the dates are equal
   let same = d1.getTime() === d2.getTime();
   if (same) return 0;
   if (d1 > d2) return 1;
   return -1;
 }
