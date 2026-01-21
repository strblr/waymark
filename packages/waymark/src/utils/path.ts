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
