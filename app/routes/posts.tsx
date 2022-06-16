import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet } from "@remix-run/react";
import { differenceInCalendarDays, parseISO } from "date-fns";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { BIRTHDATE } from "~/secrets/constants";

const birthdate = parseISO(BIRTHDATE);
const today = new Date();

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  return json({});
};

export default function PostsPage() {
  const user = useUser();

  const t9nDictionary: { [key: string]: string } = {
    "Ken’s Journey": "健の冒険",
    Logout: "ログアウト",
  };

  function t9n(str: string) {
    return user.lang === "ja" ? t9nDictionary[str] : str;
  }

  return (
    <div>
      {/* =============== HEADER =============== */}
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to="/login">{t9n("Ken’s Journey")}</Link>
        </h1>
        <div className="flex items-center justify-end">
          <span className="pr-4"></span>
          <NavLink className="pr-4" to="/posts">
            Posts
          </NavLink>
          <Form action="/logout" method="post">
            <button
              type="submit"
              className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
            >
              {t9n("Logout")}
            </button>
          </Form>
        </div>
      </header>

      {/* =============== MESSAGE TO USER =============== */}
      <main className="bg-white p-4">
        <div className="mb-4 h-full w-80 border-r bg-gray-50">
          {user.lang === "ja"
            ? `${user.addressAs}へようこそ！`
            : `Welcome ${user.addressAs}!`}{" "}
          I’m {differenceInCalendarDays(today, birthdate)} days old today!
        </div>

        {/* =============== OUTLET =============== */}
        <Outlet />
      </main>
    </div>
  );
}
