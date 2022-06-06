import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { marked } from "marked";

import type { Post } from "~/models/post.server";
import { getPost } from "~/models/post.server";
import { AWS_PHOTO_BUCKET_URL } from "~/secrets/constants"


type LoaderData = { post: Post; html: string };

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.dateSlug, `params.dateSlug is required`);
  const post = await getPost(params.dateSlug);
  invariant(post, `Post not found: ${params.dateSlug}`);
  
  const html = marked(post.markdown);
  return json<LoaderData>({ post, html });
};

export default function PostDateSlug() {
  const { post, html } = useLoaderData<LoaderData>();
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">
        {post.title}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: prependAwsBucketUrlToImages(html) }} />
    </main>
  );
}

function prependAwsBucketUrlToImages(htmlText: string) {
  // Regex matches all patterns of `src="` (Group1), then "20" followed by six numerical digits followed by underscore (Group2).
  // Note: This regex will break the UI for photos made in the year 2100 and later, but we will worry about that then.
  // E.g. `src="20210910_` matches the regex.
  const regex = /(src=")(20\d{6}_)/gm
  // $1 references Group1, and $2 references Group2.
  return htmlText.replace(regex, `$1${AWS_PHOTO_BUCKET_URL}$2`)
}
