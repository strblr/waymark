import { parse } from "regexparam";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { NormalizePath } from "./types";

export function normalizePath<P extends string>(path: P) {
  const normalized = `/${path}`
    .replaceAll(/\/+/g, "/")
    .replace(/(.+)\/$/, "$1");
  return normalized as NormalizePath<P>;
}

export function parsePattern(pattern: string) {
  const { keys, pattern: regex } = parse(pattern);
  const looseRegex = parse(pattern, true).pattern;
  const weights = patternWeights(pattern);
  return { keys, regex, looseRegex, weights };
}

function patternWeights(pattern: string): number[] {
  return pattern
    .split("/")
    .slice(1)
    .map(s => (s.includes("*") ? 0 : s.includes(":") ? 1 : 2));
}

export function validator<Input, Output>(
  validate:
    | ((input: Input) => Output)
    | StandardSchemaV1<Record<string, unknown>, Output>
) {
  if (typeof validate === "function") {
    return validate;
  } else {
    return (input: Input) => {
      const result = validate["~standard"].validate(input);
      if (result instanceof Promise) {
        throw new Error("[Waymark] Validation must be synchronous");
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
