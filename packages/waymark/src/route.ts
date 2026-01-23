import { lazy, type ComponentType } from "react";
import { parse } from "regexparam";
import type { Merge } from "type-fest";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { ComponentLoader } from "./types";
import {
  normalizePath,
  patternWeights,
  errorBoundary,
  validator,
  type ParsePattern,
  type NormalizePath,
  type OptionalOnUndefined
} from "./utils";

export function route<P extends string>(pattern: P) {
  type Pattern = NormalizePath<P>;
  type Params = ParsePattern<Pattern>;
  return new Route<Pattern, Params, {}>(
    normalizePath(pattern),
    search => search,
    [],
    []
  );
}

export class Route<P extends string, Ps extends {}, S extends {}> {
  _: {
    pattern: P;
    _params?: Ps;
    _search?: S;
    keys: string[];
    regex: RegExp;
    looseRegex: RegExp;
    weights: number[];
    mapSearch: (search: Record<string, unknown>) => S;
    components: ComponentType[];
    preloaded: boolean;
    preloaders: (() => Promise<any>)[];
  };

  constructor(
    pattern: P,
    mapSearch: (search: Record<string, unknown>) => S,
    components: ComponentType[],
    preloaders: (() => Promise<any>)[]
  ) {
    const { keys, pattern: regex } = parse(pattern);
    const looseRegex = parse(pattern, true).pattern;
    const weights = patternWeights(pattern);
    this._ = {
      pattern,
      keys,
      regex,
      looseRegex,
      weights,
      mapSearch,
      components,
      preloaded: false,
      preloaders
    };
  }

  route<P2 extends string>(subPattern: P2) {
    type Pattern = NormalizePath<`${P}/${P2}`>;
    type Params = ParsePattern<Pattern>;
    const { pattern, mapSearch, components, preloaders } = this._;
    return new Route<Pattern, Params, S>(
      normalizePath(`${pattern}/${subPattern}`),
      mapSearch,
      components,
      preloaders
    );
  }

  search<S2 extends {}>(
    mapper:
      | ((search: S & Record<string, unknown>) => S2)
      | StandardSchemaV1<S & Record<string, unknown>, S2>
  ) {
    type Search = Merge<S, OptionalOnUndefined<S2>>;
    const { pattern, mapSearch, components, preloaders } = this._;
    mapper = validator(mapper);
    return new Route<P, Ps, Search>(
      pattern,
      search => {
        const mapped = mapSearch(search);
        return { ...mapped, ...mapper(mapped) };
      },
      components,
      preloaders
    );
  }

  component(component: ComponentType) {
    const { pattern, mapSearch, components, preloaders } = this._;
    return new Route<P, Ps, S>(
      pattern,
      mapSearch,
      [...components, component],
      preloaders
    );
  }

  lazy(loader: ComponentLoader) {
    const { pattern, mapSearch, components, preloaders } = this._;
    const component = lazy(async () => {
      const result = await loader();
      return "default" in result ? result : { default: result };
    });
    return new Route<P, Ps, S>(
      pattern,
      mapSearch,
      [...components, component],
      [...preloaders, loader]
    );
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
}
