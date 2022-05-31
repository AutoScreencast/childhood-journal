import { validatePassword } from "./utils";

test("validatePassword returns false for empty strings", () => {
  expect(validatePassword(undefined)).toBe(false);
  expect(validatePassword(null)).toBe(false);
  expect(validatePassword("")).toBe(false);
});
