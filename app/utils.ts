import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

import { AWS_PHOTO_BUCKET_URL } from "~/secrets/constants";
import type { User } from "~/models/user.server";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.username === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validatePassword(password: unknown): password is string {
  return typeof password === "string" && password.length > 0;
}

export function prependAwsBucketUrlToImages(htmlText: string) {
  // Regex matches all patterns of `src="` (Group1), then "20" followed by six numerical digits followed by underscore (Group2).
  // Note: This regex will break the UI for photos made in the year 2100 and later, but we will worry about that then.
  // E.g. `src="20210910_` matches the regex.
  const regex = /(src=")(20\d{6}_)/gm;
  // $1 references Group1, and $2 references Group2.
  return htmlText.replace(regex, `$1${AWS_PHOTO_BUCKET_URL}$2`);
}
