export type Pretty<T> = { [K in keyof T]: T[K] } & NonNullable<unknown>;

export type Assign<T extends object, U extends object> = Pretty<
  Omit<T, keyof U> & U
>;

export type MaybeOptional<T, K extends string> = [keyof T] extends [never]
  ? { [P in K]?: undefined }
  : {} extends T
  ? { [P in K]?: T }
  : { [P in K]: T };
