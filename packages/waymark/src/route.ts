import { lazy, type ComponentType } from "react";
import { parse } from "regexparam";
import type { Merge } from "type-fest";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { Handle, ComponentLoader } from "./types";
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
    []
  );
}

export class Route<
  P extends string = string,
  Ps extends {} = any,
  S extends {} = any
> {
  pattern: P;
  _: {
    _params?: Ps;
    _search?: S;
    keys: string[];
    regex: RegExp;
    looseRegex: RegExp;
    weights: number[];
    mapSearch: (search: Record<string, unknown>) => S;
    handles: Handle[];
    components: ComponentType[];
    preloaded: boolean;
    preloaders: (() => Promise<any>)[];
  };

  constructor(
    pattern: P,
    mapSearch: (search: Record<string, unknown>) => S,
    handles: Handle[],
    components: ComponentType[],
    preloaders: (() => Promise<any>)[]
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
      preloaded: false,
      preloaders
    };
  }

  route<P2 extends string>(subPattern: P2) {
    type P_ = NormalizePath<`${P}/${P2}`>;
    type Ps = ParsePattern<P_>;
    const { mapSearch, handles, components, preloaders } = this._;
    return new Route<P_, Ps, S>(
      normalizePath(`${this.pattern}/${subPattern}`),
      mapSearch,
      handles,
      components,
      preloaders
    );
  }

  search<S2 extends {}>(
    mapper:
      | ((search: S & Record<string, unknown>) => S2)
      | StandardSchemaV1<S & Record<string, unknown>, S2>
  ) {
    type S_ = Merge<S, OptionalOnUndefined<S2>>;
    const { mapSearch, handles, components, preloaders } = this._;
    mapper = validator(mapper);
    return new Route<P, Ps, S_>(
      this.pattern,
      search => {
        const mapped = mapSearch(search);
        return { ...mapped, ...mapper(mapped) };
      },
      handles,
      components,
      preloaders
    );
  }

  handle(handle: Handle) {
    const { mapSearch, handles, components, preloaders } = this._;
    return new Route<P, Ps, S>(
      this.pattern,
      mapSearch,
      [...handles, handle],
      components,
      preloaders
    );
  }

  component(component: ComponentType) {
    const { mapSearch, handles, components, preloaders } = this._;
    return new Route<P, Ps, S>(
      this.pattern,
      mapSearch,
      handles,
      [...components, component],
      preloaders
    );
  }

  lazy(loader: ComponentLoader) {
    const { mapSearch, handles, components, preloaders } = this._;
    const component = lazy(async () => {
      const result = await loader();
      return "default" in result ? result : { default: result };
    });
    return new Route<P, Ps, S>(
      this.pattern,
      mapSearch,
      handles,
      [...components, component],
      [...preloaders, loader]
    );
  }

  suspense(component: ComponentType) {
    return this.component(suspenseBoundary(component));
  }

  error(component: ComponentType<{ error: unknown }>) {
    return this.component(errorBoundary(component));
  }

  async preload() {
    const { preloaded, preloaders } = this._;
    if (preloaded) return;
    this._.preloaded = true;
    await Promise.all(preloaders.map(loader => loader()));
  }

  toString() {
    return this.pattern;
  }
}
