export type Pretty<T> = { [K in keyof T]: T[K] } & NonNullable<unknown>;

export type MaybeOptional<T, K extends string> = {} extends T
  ? Partial<Record<K, T>>
  : Record<K, T>;
