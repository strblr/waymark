import { lazy, memo, type ComponentType } from "react";
import type { Merge } from "type-fest";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { Handle, PreloadContext, ComponentLoader } from "./types";
import {
  normalizePath,
  parsePattern,
  suspenseBoundary,
  errorBoundary,
  validator,
  type ParsePattern,
  type NormalizePath,
  type OptionalOnUndefined
} from "./utils";

export function route<P extends string>(pattern: P) {
  type P_ = NormalizePath<P>;
  type Ps = ParsePattern<P_>;
  const normalized = normalizePath(pattern);
  return new Route<P_, Ps, {}>(normalized, {
    ...parsePattern(normalized),
    validate: search => search,
    handles: [],
    components: [],
    preloads: []
  });
}

export class Route<
  P extends string = string,
  Ps extends {} = any,
  S extends {} = any
> {
  readonly pattern: P;
  readonly _types!: {
    params: Ps;
    search: S;
  };
  readonly _: {
    keys: string[];
    regex: RegExp;
    looseRegex: RegExp;
    weights: number[];
    validate: (search: Record<string, unknown>) => S;
    handles: Handle[];
    components: ComponentType[];
    preloads: ((context: PreloadContext) => Promise<any>)[];
  };

  constructor(pattern: P, _: typeof this._) {
    this.pattern = pattern;
    this._ = _;
  }

  route<P2 extends string>(pattern: P2) {
    type P_ = NormalizePath<`${P}/${P2}`>;
    type Ps = ParsePattern<P_>;
    const normalized = normalizePath(`${this.pattern}/${pattern}`);
    return new Route<P_, Ps, S>(normalized, {
      ...this._,
      ...parsePattern(normalized)
    });
  }

  search<S2 extends {}>(
    validate:
      | ((search: S & Record<string, unknown>) => S2)
      | StandardSchemaV1<Record<string, unknown>, S2>
  ) {
    type S_ = Merge<S, OptionalOnUndefined<S2>>;
    validate = validator(validate);
    return new Route<P, Ps, S_>(this.pattern, {
      ...this._,
      validate: search => {
        const validated = this._.validate(search);
        return { ...validated, ...validate({ ...search, ...validated }) };
      }
    });
  }

  handle(handle: Handle) {
    return new Route<P, Ps, S>(this.pattern, {
      ...this._,
      handles: [...this._.handles, handle]
    });
  }

  preload(preload: (context: PreloadContext<this>) => Promise<any>) {
    return new Route<P, Ps, S>(this.pattern, {
      ...this._,
      preloads: [
        ...this._.preloads,
        context =>
          preload({
            params: context.params,
            search: this._.validate(context.search)
          })
      ]
    });
  }

  component(component: ComponentType) {
    return new Route<P, Ps, S>(this.pattern, {
      ...this._,
      components: [...this._.components, memo(component)]
    });
  }

  lazy(loader: ComponentLoader) {
    const component = lazy(async () => {
      const result = await loader();
      return { default: "default" in result ? result.default : result };
    });
    return this.preload(loader).component(component);
  }

  suspense(fallback: ComponentType) {
    return this.component(suspenseBoundary(fallback));
  }

  error(fallback: ComponentType<{ error: unknown }>) {
    return this.component(errorBoundary(fallback));
  }

  toString() {
    return this.pattern;
  }
}
