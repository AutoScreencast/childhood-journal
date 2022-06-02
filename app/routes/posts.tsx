import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  console.log("userId >>>", userId);
  return json({});
};

export default function PostsPage() {
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      {/* =============== HEADER =============== */}
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to="/login">Ken’s Journey</Link>
        </h1>
        <div className="flex items-center justify-end">
          <span className="pr-4">Welcome {user.name}!</span>
          <Form action="/logout" method="post">
            <button
              type="submit"
              className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
            >
              Logout
            </button>
          </Form>
        </div>
      </header>
      {/* =============== /HEADER =============== */}

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">Hello {user.name}</div>

        {/* <div className="flex-1 p-6">
          <Outlet />
        </div> */}
      </main>
    </div>
  );
}
