import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useSearchParams,
  useTransition,
} from "@remix-run/react";
import * as React from "react";

import { createUserSession, getUserId } from "~/session.server";
import { verifyLogin } from "~/models/user.server";
import { safeRedirect } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors?: {
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/posts"); // TODO: Create posts page route

  if (typeof password !== "string" || password.length === 0) {
    return json<ActionData>(
      {
        errors: {
          password: "Please enter your password | パスワードを入力してください",
        },
      },
      { status: 400 }
    );
  }

  // Passwords are at least 9 characters long...
  if (password.length < 9) {
    return json<ActionData>(
      {
        errors: {
          password:
            "The password entered is too short | 入力したパスワードが短すぎる",
        },
      },
      { status: 400 }
    );
  }

  const user = await verifyLogin(password);

  if (!user) {
    return json<ActionData>(
      {
        errors: {
          password:
            "Sorry! The password entered is incorrect. Please try again. | ごめん！ 入力したパスワードが正しくない。 もう一度やり直してください。",
        },
      },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    redirectTo,
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Login | ログイン",
  };
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/posts";
  const actionData = useActionData() as ActionData;
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const transition = useTransition();
  const isLoggingIn = Boolean(transition.submission);

  React.useEffect(() => {
    if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password | パスワード
            </label>
            <div className="mt-1 flex flex-col content-center">
              <input
                autoComplete="new-password" // still does not get rid of password suggestions in Chrome at least
                autoFocus
                id="password"
                ref={passwordRef}
                name="password"
                type="text" // Use text type instead of password type for elderly users so they can see what they’re typing
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.password && (
                <div
                  className="pt-1 text-center text-red-700"
                  id="password-error"
                >
                  {actionData.errors.password}
                </div>
              )}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            disabled={isLoggingIn}
            type="submit"
            className="w-full rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            {isLoggingIn
              ? "Logging in... | ログイン中。。。"
              : "Log in | ログイン"}
          </button>
        </Form>
      </div>
    </div>
  );
}
