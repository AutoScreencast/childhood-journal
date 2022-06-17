import { Form, Link, NavLink } from "@remix-run/react";

import { useUser } from "~/utils";

export function Header() {
  const user = useUser();

  const t9nDictionary: { [key: string]: string } = {
    "Ken’s Journey": "健の冒険",
    Logout: "ログアウト",
  };

  function t9n(str: string) {
    return user?.lang === "ja" ? t9nDictionary[str] : str;
  }

  return (
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
  );
}
