import { type ComponentType, lazy } from "react";
import { type RouteParams, parse } from "regexparam";
import { useParams, useSearch } from "./react";
import {
  normalizePath,
  type Assign,
  type NormalizePath,
  type ComponentLoader
} from "./utils";

export class Route<Path extends string, Params extends {}, Search extends {}> {
  _keys: string[];
  _pattern: RegExp;
  _prefixPattern: RegExp;
  _preloaded = false;

  constructor(
    public _path: Path,
    public _mapParams: (params: Record<string, string>) => Params,
    public _mapSearch: (search: Record<string, unknown>) => Search,
    public _components: ComponentType[],
    public _preloaders: (() => Promise<any>)[]
  ) {
    const { keys, pattern } = parse(_path);
    this._keys = keys;
    this._pattern = pattern;
    this._prefixPattern = parse(_path, true).pattern;
  }

  route<SubPath extends string>(subPath: SubPath) {
    type NextParams = Assign<RouteParams<SubPath>, Params>;
    return new Route<NormalizePath<`${Path}/${SubPath}`>, NextParams, Search>(
      normalizePath(`${this._path}/${subPath}`),
      this._mapParams as any,
      this._mapSearch,
      this._components,
      this._preloaders
    );
  }

  params<NextParams extends {}>(mapParams: (params: Params) => NextParams) {
    type MergedParams = Assign<Params, NextParams>;
    return new Route<Path, MergedParams, Search>(
      this._path,
      params => {
        const mapped = this._mapParams(params);
        return { ...mapped, ...mapParams(mapped) };
      },
      this._mapSearch,
      this._components,
      this._preloaders
    );
  }

  search<NextSearch extends {}>(
    mapSearch: (search: Search & Record<string, unknown>) => NextSearch
  ) {
    type MergedSearch = Assign<Search, NextSearch>;
    return new Route<Path, Params, MergedSearch>(
      this._path,
      this._mapParams,
      search => {
        const mapped = this._mapSearch(search);
        return { ...mapped, ...mapSearch(mapped) };
      },
      this._components,
      this._preloaders
    );
  }

  component(component: ComponentType) {
    return new Route<Path, Params, Search>(
      this._path,
      this._mapParams,
      this._mapSearch,
      [...this._components, component],
      this._preloaders
    );
  }

  lazy(loader: ComponentLoader) {
    const lazyLoader = async () => {
      const result = await loader();
      return "default" in result ? result : { default: result };
    };
    return new Route<Path, Params, Search>(
      this._path,
      this._mapParams,
      this._mapSearch,
      [...this._components, lazy(lazyLoader)],
      [...this._preloaders, loader]
    );
  }

  preload() {
    if (this._preloaded) return;
    this._preloaders.forEach(loader => loader());
    this._preloaded = true;
  }

  useParams(): Params {
    return useParams(this);
  }

  useSearch(): Search {
    return useSearch(this);
  }
}

export function route<Path extends string>(path: Path) {
  type NormalizedPath = NormalizePath<Path>;
  return new Route<NormalizedPath, RouteParams<NormalizedPath>, {}>(
    normalizePath(path),
    params => params as any,
    search => search,
    [],
    []
  );
}
