import { Link } from "@remix-run/react";

import { Header } from "~/components/header";
import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();

  return (
    <main>
      {user ? (
        <>
          <Header />
          <div className="container mx-auto">
            <Link to="/posts">
              {user.lang === "ja"
                ? `${user.name}にようこそ！ 投稿を見る`
                : `Welcome back ${user.name}! View Posts`}
            </Link>
          </div>
        </>
      ) : (
        <>
          <h1>Ken’s Journey | 健の冒険</h1>
          <p>This is a private site. | これはプライベートサイトです。</p>
          <Link to="/login">"Log In | ログイン"</Link>
        </>
      )}
    </main>
  );
}
