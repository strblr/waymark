import { normalizePath } from "./route";
import { parseSearch, stringifySearch } from "./search";
import type { Match } from "../types";

export function absolutePath(rpath: string, basePath: string) {
  return normalizePath(`${basePath}/${rpath}`);
}

export function relativePath(path: string, basePath: string) {
  if (path === basePath || path.startsWith(`${basePath}/`)) {
    path = path.slice(basePath.length) || "/";
  }
  return path;
}

export function mergeUrl(path: string, search: Record<string, unknown>) {
  return [path, stringifySearch(search)].filter(Boolean).join("?");
}

export function parseUrl(url: string) {
  const { pathname, search } = new URL(url, "http://w");
  return { path: pathname, search: parseSearch(search) };
}

export function matchRegex(
  regex: RegExp,
  keys: string[],
  path: string,
  basePath: string
) {
  const matches = regex.exec(relativePath(path, basePath));
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
