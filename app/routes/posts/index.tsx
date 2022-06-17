import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";

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
  const [loading, setLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  // console.log("image", post.dateSlug, "loading:", loading);
  // console.log(
  //   "image",
  //   post.dateSlug,
  //   "load complete?:",
  //   !!imgRef?.current?.complete
  // );

  return (
    <div className="mb-2 w-1/2 px-1 md:mb-4 md:w-1/3 md:px-2 lg:mb-6 lg:w-1/4 lg:px-3 xl:mb-8 xl:w-1/5 xl:px-4">
      <Link to={post.dateSlug}>
        <div
          className={
            loading && !imgRef?.current?.complete
              ? "mx-auto w-full max-w-sm rounded shadow-md"
              : "hidden"
          }
        >
          <div className="flex animate-pulse space-x-4">
            <div className="aspect-[3/4] w-full bg-slate-300"></div>
          </div>
        </div>
        <img
          alt={post.title}
          className={
            loading || !imgRef?.current?.complete
              ? "hidden"
              : "fadeIn1s rounded shadow-md"
          }
          onLoad={() => setLoading(false)}
          ref={imgRef}
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
