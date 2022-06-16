import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import {
  // getPosts,
  getPostsSinceBeginningOfLastMonthSortedByDescendingDate,
  // getPostsSortedByDescendingDate,
} from "~/models/post.server";
import { AWS_PHOTO_BUCKET_URL } from "~/secrets/constants";
import type { AugmentedPost } from "~/models/post.server";

type LoaderData = {
  posts: Awaited<
    ReturnType<typeof getPostsSinceBeginningOfLastMonthSortedByDescendingDate>
  >;
};

export const loader = async () => {
  return json<LoaderData>({
    posts: await getPostsSinceBeginningOfLastMonthSortedByDescendingDate(),
  });
};

function TextLinkItem({
  post,
}: {
  post: Omit<AugmentedPost, "createdAt" | "updatedAt">;
}) {
  return (
    <div className="mb-2 w-1/2 px-1 md:mb-4 md:w-1/3 md:px-2 lg:mb-6 lg:w-1/4 lg:px-3 xl:mb-8 xl:w-1/5 xl:px-4">
      <Link to={post.dateSlug}>
        <img
          alt={post.title}
          className="rounded shadow-md"
          src={`${AWS_PHOTO_BUCKET_URL}${post.featuredImage}`}
        />
        {/* {post.title} - {post.dateSlug} - {post.daysSinceBirth} -{" "}
        {post.formattedDate} */}
      </Link>
    </div>
  );
}

export default function Posts() {
  const { posts } = useLoaderData<LoaderData>();
  return (
    <main className="container mx-auto">
      <section className="">
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <TextLinkItem post={post} key={post.dateSlug} />
          ))}
        </div>
      </section>
    </main>
  );
}
