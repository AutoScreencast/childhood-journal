import { json, LoaderFunction } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import { format, formatISO } from "date-fns";

import {
  // getPosts,
  // getPostsSinceBeginningOfPreviousMonthSortedByDescendingDate,
  // getPostsSinceBeginningOfMonthPreviousToLastPostDateSortedByDescendingDate,
  // getPostsSinceBeginningOfMonthOfLastPostDateSortedByDescendingDate,
  // getPostsChunkedByMonth,
  getPostsChunkedByMonthGiven,
  // getPostsSortedByDescendingDate,
} from "~/models/post.server";
import { AWS_PHOTO_BUCKET_URL } from "~/secrets/constants";
import type { AugmentedPost } from "~/models/post.server";

function getMonth(searchParams: URLSearchParams) {
  return searchParams.get("month") || "2022-05";
}

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPostsChunkedByMonthGiven>>;
};
export const loader: LoaderFunction = async ({ request }) => {
  const month = getMonth(new URL(request.url).searchParams);
  console.log({ month });
  
  return json<LoaderData>({
    // posts: await getPostsChunkedByMonthGiven(new Date().toISOString()),
    posts: await getPostsChunkedByMonthGiven(month),
  });
};

type PostItemType = Omit<AugmentedPost, "createdAt" | "updatedAt">;
function PostItem({
  post,
}: {
  post: PostItemType;
}) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <div className="mb-2 w-1/2 px-1 md:mb-4 md:w-1/3 md:px-2 lg:mb-6 lg:w-1/4 lg:px-3 xl:mb-8 xl:w-1/5 xl:px-4">
        <Link to={post.dateSlug}>
          <div
            className={
              loading ? "mx-auto w-full max-w-sm rounded shadow-md" : "hidden"
            }
          >
            <div className="flex animate-pulse space-x-4">
              <div className="aspect-[3/4] w-full bg-slate-300"></div>
            </div>
          </div>
          <img
            alt={post.title}
            className={loading ? "hidden" : "fadeIn1s rounded shadow-md"}
            onLoad={() => setLoading(false)}
            ref={(imageElement: HTMLImageElement) => {
              if (imageElement && imageElement.complete) setLoading(false);
            }}
            src={`${AWS_PHOTO_BUCKET_URL}${post.featuredImage}`}
          />
          {/* {post.title} - {post.dateSlug} - {post.daysSinceBirth} -{" "}
        {post.formattedDate} */}
        </Link>
      </div>
    </>
  );
}

export default function Posts() {
  const data = useLoaderData<LoaderData>();
  const initialPosts = data.posts;
  const [posts, setPosts] = useState(initialPosts);
  // Start with "2022-04" because "2022-05" was pre-loaded
  const [month, setMonth] = useState("2022-04");

  const fetcher = useFetcher();

  // useEffect(() => console.log('posts >>>', posts), [posts]);
  useEffect(() => console.log('month >>>', month), [month]);

  const [scrollPosition, setScrollPosition] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const [height, setHeight] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(true);

  // Add Listeners to scroll and client resize
  useEffect(() => {
    const scrollListener = () => {
      setClientHeight(window.innerHeight);
      setScrollPosition(window.scrollY);
    };

    // Avoid running during SSR
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", scrollListener);
    }

    // Clean up
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", scrollListener);
      }
    };
  }, []);

  // Set height of the parent container whenever photo posts are loaded
  const mainHeight = useCallback(
    (node) => {
      if (node !== null) {
        setHeight(node.getBoundingClientRect().height);
      }
    },
    [posts.length]
  );

  // Listen on scrolls. Fire on some self-described breakpoint
  useEffect(() => {
    if (!shouldFetch || !height) return;
    if (clientHeight + scrollPosition + 100 < height) return;
    console.log("SHOULD BE FETCHING!"); // FIXME: is called too often when scrolling
    fetcher.load(`/posts?index&month=${month}`);

    setShouldFetch(false);
  }, [clientHeight, scrollPosition]);

  // Merge posts, increment month, and allow fetching again
  useEffect(() => {
    // Discontinue backend calls if the last page has been reached
    if (fetcher.data?.posts && !fetcher.data?.posts[month]) {
      setShouldFetch(false);
      return;
    }

    // Posts contain data, merge them and allow the possiblity of another fetch
    if (fetcher.data?.posts) {
      setPosts((prevPosts) => ({...prevPosts, ...fetcher.data.posts}));
      setMonth((month) => getPreviousMonth(month));
      setShouldFetch(true);
    }
  }, [fetcher.data?.posts]);

  return (
    <main className="container mx-auto" ref={mainHeight}>
      <section>
        {Object.keys(posts).map((month) => {
          const date = new Date(month);
          return (
            <div key={month}>
              <div className="flex">
                <div className="mr-1">{format(date, "MMMM")}</div>
                <div>{format(date, "YYY")}</div>
              </div>
              <div className="flex flex-wrap">
                {posts[month].map((post) => (
                  <PostItem post={post} key={post.dateSlug} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}

// Utility function
// month parameter is in form, e.g. "2022-05"
// returned month is in same form.
function getPreviousMonth(month: string) {
  const currentMonth = new Date(month);
  const prevMonth = currentMonth.getMonth() - 1;
  const firstDayOfMonth = 1;
  // Because of how dates work in JavaScript, the value of the year gets rolled back if we subtract 1 month from January.
  const firstDayPreviousMonth = new Date(
    currentMonth.getFullYear(),
    prevMonth,
    firstDayOfMonth
  );
  const dateSlugOfFirstDayPreviousMonth = formatISO(firstDayPreviousMonth, {
    representation: "date",
  }); // to get date string in format "YYYY-MM-DD"
  return dateSlugOfFirstDayPreviousMonth.substring(0, 7);
}