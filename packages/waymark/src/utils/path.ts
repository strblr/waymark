export type NormalizePath<P extends string> = RemoveTrailingSlash<
  DedupSlashes<`/${P}`>
>;

type DedupSlashes<P extends string> = P extends `${infer Prefix}//${infer Rest}`
  ? `${Prefix}${DedupSlashes<`/${Rest}`>}`
  : P;

type RemoveTrailingSlash<P extends string> = P extends `${infer Prefix}/`
  ? Prefix extends ""
    ? "/"
    : Prefix
  : P;

export function normalizePath<P extends string>(path: P) {
  const normalized = `/${path}`
    .replaceAll(/\/+/g, "/")
    .replace(/(.+)\/$/, "$1");
  return normalized as NormalizePath<P>;
}

export function extractParams(path: string, pattern: RegExp, keys: string[]) {
  const out: Record<string, string> = {};
  let matches = pattern.exec(path);
  if (matches) {
    for (let i = 0; i < keys.length; i++) {
      const match = matches[i + 1];
      if (match) {
        out[keys[i]] = match;
      }
    }
  }
  return out;
}
