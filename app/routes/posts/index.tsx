import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getPosts, getPostsSortedByDescendingDate } from "~/models/post.server";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPostsSortedByDescendingDate>>;
};

export const loader = async () => {
  return json<LoaderData>({
    posts: await getPostsSortedByDescendingDate(),
  });
};

export default function Posts() {
  const { posts } = useLoaderData<LoaderData>();
  return (
    <main>
      <h1>Posts</h1>
      <ul>
        {posts
          // .sort((a, b) => compareDates(a.dateSlug, b.dateSlug))
          .map((post) => (
          <li key={post.dateSlug}>
            <Link
              to={post.dateSlug}
              className="text-blue-600 underline"
            >
              {post.title} - {post.dateSlug} - {post.daysSinceBirth} - {post.formattedDate}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
