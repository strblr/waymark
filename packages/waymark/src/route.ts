import { type ComponentType, lazy } from "react";
import { type RouteParams, parse } from "regexparam";
import type { Merge } from "type-fest";
import {
  normalizePath,
  type NormalizePath,
  type ComponentLoader,
  type OptionalOnUndefined
} from "./utils";

export class RouteConfig<P extends string, Prm extends {}, S extends {}> {
  _: {
    path: P;
    mapSearch: (search: Record<string, unknown>) => S;
    components: ComponentType[];
    preloaded: boolean;
    preloaders: (() => Promise<any>)[];
    keys: string[];
    pattern: RegExp;
    prefixPattern: RegExp;
  };

  constructor(
    path: P,
    mapSearch: (search: Record<string, unknown>) => S,
    components: ComponentType[],
    preloaders: (() => Promise<any>)[]
  ) {
    const { keys, pattern } = parse(path);
    this._ = {
      path,
      mapSearch,
      components,
      preloaded: false,
      preloaders,
      keys,
      pattern,
      prefixPattern: parse(path, true).pattern
    };
  }

  route<SubPath extends string>(subPath: SubPath) {
    type NextParams = Merge<RouteParams<SubPath>, Prm>;
    const { path, mapSearch, components, preloaders } = this._;
    return new RouteConfig<NormalizePath<`${P}/${SubPath}`>, NextParams, S>(
      normalizePath(`${path}/${subPath}`),
      mapSearch,
      components,
      preloaders
    );
  }

  search<NextSearch extends {}>(
    mapper: (search: S & Record<string, unknown>) => NextSearch
  ) {
    type MergedSearch = Merge<S, OptionalOnUndefined<NextSearch>>;
    const { path, mapSearch, components, preloaders } = this._;
    return new RouteConfig<P, Prm, MergedSearch>(
      path,
      search => {
        const mapped = mapSearch(search);
        return { ...mapped, ...mapper(mapped) };
      },
      components,
      preloaders
    );
  }

  component(component: ComponentType) {
    const { path, mapSearch, components, preloaders } = this._;
    return new RouteConfig<P, Prm, S>(
      path,
      mapSearch,
      [...components, component],
      preloaders
    );
  }

  lazy(loader: ComponentLoader) {
    const { path, mapSearch, components, preloaders } = this._;
    const lazyLoader = async () => {
      const result = await loader();
      return "default" in result ? result : { default: result };
    };
    return new RouteConfig<P, Prm, S>(
      path,
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

export function route<P extends string>(path: P) {
  type NormalizedPath = NormalizePath<P>;
  return new RouteConfig<NormalizedPath, RouteParams<NormalizedPath>, {}>(
    normalizePath(path),
    search => search,
    [],
    []
  );
}
