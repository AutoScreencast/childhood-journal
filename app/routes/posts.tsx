import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, Outlet } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { BIRTHDATE } from "~/secrets/constants";


export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  return json({});
};

export default function PostsPage() {
  const user = useUser();

  const t9nDictionary: {[key: string]: string} = {
    "Ken’s Journey": "健の冒険",
    "Logout": "ログアウト",
  }

  function t9n(str: string) {
    return user.lang === "ja" ? t9nDictionary[str] : str
  }

  return (
    <div className="flex h-full min-h-screen flex-col">
      {/* =============== HEADER =============== */}
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to="/login">{t9n("Ken’s Journey")}</Link>
        </h1>
        <div className="flex items-center justify-end">
          <span className="pr-4">{user.lang === "ja" ? `${user.addressAs}へようこそ！` : `Welcome ${user.addressAs}!`}</span>
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
      {/* =============== /HEADER =============== */}

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">Hello {user.addressAs}! I’m {daysBetweenThenAndToday(BIRTHDATE)} days old today!</div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// https://stackoverflow.com/questions/542938/how-to-calculate-number-of-days-between-two-dates
// Based on Michael Liu's answer.

function treatAsUTC(date: string | Date) {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

function daysBetweenThenAndToday(then: string) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const preciseDifference = (treatAsUTC(new Date).getTime() - treatAsUTC(then).getTime()) / millisecondsPerDay;
  return Math.floor(preciseDifference);
}
