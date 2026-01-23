import type { Route } from "../route";
import type { NormalizePath } from "./types";

export function normalizePath<P extends string>(path: P) {
  const normalized = `/${path}`
    .replaceAll(/\/+/g, "/")
    .replace(/(.+)\/$/, "$1");
  return normalized as NormalizePath<P>;
}

export function patternWeights(pattern: string): number[] {
  return pattern
    .split("/")
    .slice(1)
    .map(s => (s.includes("*") ? 0 : s.includes(":") ? 1 : 2));
}

export function joinHref(path: string, search?: string) {
  return `${path}${search ? `?${search}` : ""}`;
}

export function extract(cpath: string, looseRegex: RegExp, keys: string[]) {
  const out: Record<string, string> = {};
  const matches = looseRegex.exec(cpath);
  if (matches) {
    keys.forEach((key, i) => {
      const match = matches[i + 1];
      if (match) {
        out[key] = match;
      }
    });
  }
  return out;
}

export function rankRoutes(routes: Route[]) {
  return [...routes].sort((a, b) => {
    const length = Math.max(a._.weights.length, b._.weights.length);
    for (let i = 0; i < length; i++) {
      const wa = a._.weights[i] ?? -1;
      const wb = b._.weights[i] ?? -1;
      if (wa !== wb) {
        return wb - wa;
      }
    }
    return 0;
  });
}
