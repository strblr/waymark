import { lazy, type ComponentType } from "react";
import { parse, type RouteParams } from "regexparam";
import type { Merge, Simplify } from "type-fest";
import {
  normalizePath,
  type NormalizePath,
  type ComponentLoader,
  type OptionalOnUndefined
} from "./utils";

export class Route<P extends string, Prm extends {}, S extends {}> {
  _: {
    pattern: P;
    mapSearch: (search: Record<string, unknown>) => S;
    components: ComponentType[];
    preloaded: boolean;
    preloaders: (() => Promise<any>)[];
    keys: string[];
    regex: RegExp;
    looseRegex: RegExp;
    _params?: Prm;
    _search?: S;
  };

  constructor(
    pattern: P,
    mapSearch: (search: Record<string, unknown>) => S,
    components: ComponentType[],
    preloaders: (() => Promise<any>)[]
  ) {
    const { keys, pattern: regex } = parse(pattern);
    const looseRegex = parse(pattern, true).pattern;
    this._ = {
      pattern,
      mapSearch,
      components,
      preloaded: false,
      preloaders,
      keys,
      regex,
      looseRegex
    };
  }

  route<P2 extends string>(subPattern: P2) {
    type Pattern = NormalizePath<`${P}/${P2}`>;
    type Params = Simplify<RouteParams<Pattern>>;
    const { pattern, mapSearch, components, preloaders } = this._;
    return new Route<Pattern, Params, S>(
      normalizePath(`${pattern}/${subPattern}`),
      mapSearch,
      components,
      preloaders
    );
  }

  search<S2 extends {}>(mapper: (search: S & Record<string, unknown>) => S2) {
    type MergedSearch = Merge<S, OptionalOnUndefined<S2>>;
    const { pattern, mapSearch, components, preloaders } = this._;
    return new Route<P, Prm, MergedSearch>(
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
    return new Route<P, Prm, S>(
      pattern,
      mapSearch,
      [...components, component],
      preloaders
    );
  }

  lazy(loader: ComponentLoader) {
    const { pattern, mapSearch, components, preloaders } = this._;
    const lazyLoader = async () => {
      const result = await loader();
      return "default" in result ? result : { default: result };
    };
    return new Route<P, Prm, S>(
      pattern,
      mapSearch,
      [...components, lazy(lazyLoader)],
      [...preloaders, loader]
    );
  }

  async preload() {
    const { preloaded, preloaders } = this._;
    if (preloaded) return;
    this._.preloaded = true;
    await Promise.all(preloaders.map(loader => loader()));
  }
}

export function route<P extends string>(pattern: P) {
  type Pattern = NormalizePath<P>;
  type Params = Simplify<RouteParams<Pattern>>;
  return new Route<Pattern, Params, {}>(
    normalizePath(pattern),
    search => search,
    [],
    []
  );
}
