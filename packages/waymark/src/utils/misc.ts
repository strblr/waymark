type Pretty<T> = { [K in keyof T]: T[K] } & {};

export type Assign<T extends object, U extends object> = Pretty<
  Omit<T, keyof U> & U
>;

export type MaybeOptional<T, K extends string> = [keyof T] extends [never]
  ? { [P in K]?: undefined }
  : {} extends T
  ? { [P in K]?: T }
  : { [P in K]: T };

export type OptionalOnUndefined<T extends object> = Pretty<
  { [K in keyof T as undefined extends T[K] ? never : K]: T[K] } & {
    [K in keyof T as undefined extends T[K] ? K : never]?: T[K];
  }
>;
