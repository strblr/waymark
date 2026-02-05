import type { RouteParams } from "regexparam";
import type { EmptyObject, Simplify } from "type-fest";

export type ParsePattern<P extends string> = Simplify<RouteParams<P>>;

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

export type MaybeKey<K extends string, T> = T extends EmptyObject
  ? { [P in K]?: EmptyObject }
  : {} extends T
  ? { [P in K]?: T }
  : { [P in K]: T };
