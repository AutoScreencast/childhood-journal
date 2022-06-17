import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { differenceInCalendarDays, parseISO } from "date-fns";

import { Header } from "~/components/header";
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

  return (
    <>
      <Header />

      <main className="bg-white p-4">
        <div className="mb-4 h-full w-80 border-r bg-gray-50">
          {user.lang === "ja"
            ? `${user.addressAs}へようこそ！`
            : `Welcome ${user.addressAs}!`}{" "}
          I’m {differenceInCalendarDays(today, birthdate)} days old today!
        </div>

        <Outlet />
      </main>
    </>
  );
}
