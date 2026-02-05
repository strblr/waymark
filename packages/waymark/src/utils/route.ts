import { parse } from "regexparam";
import type { NormalizePath } from "./types";
import type { Validator } from "../types";

export function normalizePath<P extends string>(path: P) {
  const normalized = `/${path}`
    .replaceAll(/\/+/g, "/")
    .replace(/(.+)\/$/, "$1");
  return normalized as NormalizePath<P>;
}

export function parsePattern<P extends string>(pattern: P) {
  const { keys, pattern: regex } = parse(pattern);
  const loose = parse(pattern, true).pattern;
  const weights = pattern
    .split("/")
    .slice(1)
    .map(s => (s.includes("*") ? 0 : s.includes(":") ? 1 : 2));
  return { pattern, keys, regex, loose, weights };
}

export function validator<Input extends {}, Output extends {}>(
  validate: Validator<Input, Output>
) {
  if (typeof validate === "function") {
    return validate;
  } else {
    return (input: Input) => {
      const result = validate["~standard"].validate(input);
      if (result instanceof Promise) {
        throw new Error("[Waymark] Validation can't be async");
      } else if (result.issues) {
        throw new Error("[Waymark] Validation failed", {
          cause: result.issues
        });
      } else {
        return result.value;
      }
    };
  }
}
