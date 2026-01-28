import { lazy, memo, type ComponentType } from "react";
import { parse } from "regexparam";
import type { Merge } from "type-fest";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { Handle, PreloadContext, ComponentLoader } from "./types";
import {
  normalizePath,
  patternWeights,
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
  return new Route<P_, Ps, {}>(
    normalizePath(pattern),
    search => search,
    [],
    [],
    async () => {}
  );
}

export class Route<
  P extends string = string,
  Ps extends {} = any,
  S extends {} = any
> {
  readonly pattern: P;
  readonly _: {
    _params?: Ps;
    _search?: S;
    keys: string[];
    regex: RegExp;
    looseRegex: RegExp;
    weights: number[];
    mapSearch: (search: Record<string, unknown>) => S;
    handles: Handle[];
    components: ComponentType[];
    preloader: (context: PreloadContext) => Promise<any>;
  };

  constructor(
    pattern: P,
    mapSearch: (search: Record<string, unknown>) => S,
    handles: Handle[],
    components: ComponentType[],
    preloader: (context: PreloadContext) => Promise<any>
  ) {
    const { keys, pattern: regex } = parse(pattern);
    const looseRegex = parse(pattern, true).pattern;
    const weights = patternWeights(pattern);
    this.pattern = pattern;
    this._ = {
      keys,
      regex,
      looseRegex,
      weights,
      mapSearch,
      handles,
      components,
      preloader
    };
  }

  route<P2 extends string>(subPattern: P2) {
    type P_ = NormalizePath<`${P}/${P2}`>;
    type Ps = ParsePattern<P_>;
    const { mapSearch, handles, components, preloader } = this._;
    return new Route<P_, Ps, S>(
      normalizePath(`${this.pattern}/${subPattern}`),
      mapSearch,
      handles,
      components,
      preloader
    );
  }

  search<S2 extends {}>(
    mapper:
      | ((search: S & Record<string, unknown>) => S2)
      | StandardSchemaV1<Record<string, unknown>, S2>
  ) {
    type S_ = Merge<S, OptionalOnUndefined<S2>>;
    const { mapSearch, handles, components, preloader } = this._;
    mapper = validator(mapper);
    return new Route<P, Ps, S_>(
      this.pattern,
      search => {
        const mapped = mapSearch(search);
        return { ...mapped, ...mapper({ ...search, ...mapped }) };
      },
      handles,
      components,
      preloader
    );
  }

  handle(handle: Handle) {
    const { mapSearch, handles, components, preloader } = this._;
    return new Route<P, Ps, S>(
      this.pattern,
      mapSearch,
      [...handles, handle],
      components,
      preloader
    );
  }

  component(component: ComponentType) {
    const { mapSearch, handles, components, preloader } = this._;
    return new Route<P, Ps, S>(
      this.pattern,
      mapSearch,
      handles,
      [...components, memo(component)],
      preloader
    );
  }

  lazy(loader: ComponentLoader) {
    const component = lazy(async () => {
      const result = await loader();
      return { default: memo("default" in result ? result.default : result) };
    });
    return this.preloader(loader).component(component);
  }

  suspense(fallback: ComponentType) {
    return this.component(suspenseBoundary(fallback));
  }

  error(fallback: ComponentType<{ error: unknown }>) {
    return this.component(errorBoundary(fallback));
  }

  preloader(fn: (context: PreloadContext<this>) => Promise<any>) {
    const { mapSearch, handles, components, preloader } = this._;
    return new Route<P, Ps, S>(
      this.pattern,
      mapSearch,
      handles,
      components,
      async context => {
        await Promise.all([
          preloader(context),
          fn({ params: context.params, search: mapSearch(context.search) })
        ]);
      }
    );
  }

  toString() {
    return this.pattern;
  }
}
