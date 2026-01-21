import type { Simplify, EmptyObject } from "type-fest";
import type { StandardSchemaV1 } from "@standard-schema/spec";

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

export function validator<Input, Output>(
  validate: ((input: Input) => Output) | StandardSchemaV1<Input, Output>
) {
  if (typeof validate === "function") {
    return validate;
  } else {
    return (input: Input) => {
      const result = validate["~standard"].validate(input);
      if (result instanceof Promise) {
        throw new Error("[Waymark] Validation must be synchronous");
      } else if (result.issues) {
        throw new Error("[Waymark] Validation failed", {
          cause: result.issues
        });
      } else {
        return result.value;
      }
    };
  }
}
