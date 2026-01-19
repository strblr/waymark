export type Pretty<T> = { [K in keyof T]: T[K] } & NonNullable<unknown>;

export type MaybeOptional<T, K extends string> = {} extends T
  ? { [P in K]?: T }
  : { [P in K]: T };
