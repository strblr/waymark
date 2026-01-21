import type { Simplify, EmptyObject } from "type-fest";

export type MaybeKey<K extends string, T> = T extends EmptyObject
  ? { [P in K]?: undefined } // EmptyObject ?
  : {} extends T
  ? { [P in K]?: T }
  : { [P in K]: T };

export type OptionalOnUndefined<T extends object> = Simplify<
  { [K in keyof T as undefined extends T[K] ? never : K]: T[K] } & {
    [K in keyof T as undefined extends T[K] ? K : never]?: T[K];
  }
>;

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}
