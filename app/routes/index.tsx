import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();

  return (
    <main>
      {user ? (
        <Link to="/posts">Welcome back {user.name}! View Posts</Link>
      ) : (
        <>
          <h1>Ken’s Journey</h1>
          <p>This is a private site.</p>
          <Link to="/login">Log In</Link>
        </>
      )}
    </main>
  );
}
