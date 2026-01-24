import { normalizeSearch, stringifySearch } from "./search";
import type { NormalizePath } from "./types";
import type { Match } from "../types";

export function normalizePath<P extends string>(path: P) {
  const normalized = `/${path}`
    .replaceAll(/\/+/g, "/")
    .replace(/(.+)\/$/, "$1");
  return normalized as NormalizePath<P>;
}

export function mergeUrl(path: string, search: Record<string, unknown>) {
  return [path, stringifySearch(search)].filter(Boolean).join("?");
}

export function splitUrl(url: string) {
  const { pathname, search } = new URL(url, "http://w");
  return { path: pathname, search: normalizeSearch(search) };
}

export function patternWeights(pattern: string): number[] {
  return pattern
    .split("/")
    .slice(1)
    .map(s => (s.includes("*") ? 0 : s.includes(":") ? 1 : 2));
}

export function matchRegex(regex: RegExp, keys: string[], cpath: string) {
  const matches = regex.exec(cpath);
  if (!matches) return null;
  const out: Record<string, string> = {};
  keys.forEach((key, i) => {
    const match = matches[i + 1];
    if (match) {
      out[key] = match;
    }
  });
  return out;
}

export function rankMatches(matches: Match[]) {
  return [...matches].sort((a, b) => {
    const was = a.route._.weights;
    const wbs = b.route._.weights;
    const length = Math.max(was.length, wbs.length);
    for (let i = 0; i < length; i++) {
      const wa = was[i] ?? -1;
      const wb = wbs[i] ?? -1;
      if (wa !== wb) {
        return wb - wa;
      }
    }
    return 0;
  });
}
