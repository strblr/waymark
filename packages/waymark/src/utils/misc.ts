import type { Simplify, EmptyObject } from "type-fest";

export type MaybeKey<K extends string, T> = T extends EmptyObject
  ? { [P in K]?: undefined }
  : {} extends T
  ? { [P in K]?: T }
  : { [P in K]: T };

export type OptionalOnUndefined<T extends object> = Simplify<
  { [K in keyof T as undefined extends T[K] ? never : K]: T[K] } & {
    [K in keyof T as undefined extends T[K] ? K : never]?: T[K];
  }
>;
