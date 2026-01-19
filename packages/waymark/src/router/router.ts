import { inject } from "regexparam";
import { BrowserHistory } from "./browser-history";
import type { LinkOptions } from "../react";
import {
  normalizePath,
  extractParams,
  toSearchString,
  parseSearchParams,
  type Routes,
  type RouteList,
  type Paths,
  type NavigateOptions,
  type HistoryLike,
  type SearchOfRoute,
  type ParamsOfRoute,
  type RouteOf
} from "../utils";

export interface RouterOptions {
  history?: HistoryLike;
  basePath?: string;
  routes: RouteList;
  defaultLinkOptions?: LinkOptions;
}

export class Router {
  history: HistoryLike;
  basePath: string;
  routes: RouteList;
  defaultLinkOptions?: LinkOptions;
  _routeMap: Map<string, Routes>;

  constructor(options: RouterOptions) {
    this.history = options.history ?? new BrowserHistory();
    this.basePath = normalizePath(options.basePath ?? "/");
    this.routes = options.routes;
    this.defaultLinkOptions = options.defaultLinkOptions;
    this._routeMap = new Map(options.routes.map(route => [route._path, route]));
  }

  get<P extends Paths>(path: P) {
    const route = this._routeMap.get(path);
    if (!route) {
      throw new Error(`Route not found for path: ${path}`);
    }
    return route as RouteOf<P>;
  }

  getFullPath(path: string): string {
    return normalizePath(`${this.basePath}/${path}`);
  }

  getCanonicalPath(path: string) {
    if (path === this.basePath || path.startsWith(`${this.basePath}/`)) {
      path = path.slice(this.basePath.length) || "/";
    }
    return path;
  }

  getRouteMatch(path: string): Routes | undefined {
    path = this.getCanonicalPath(path);
    return this.routes.find(route => route._pattern.test(path));
  }

  resolvePath<P extends Paths>(options: NavigateOptions<P>) {
    const { to, params, search } = options;
    let path: string = to;
    params && (path = inject(path, params));
    path = this.getFullPath(path);
    const searchString = search && toSearchString(search);
    searchString && (path = `${path}?${searchString}`);
    return path;
  }

  resolveParams<R extends Routes>(route: R, path: string): ParamsOfRoute<R> {
    path = this.getCanonicalPath(path);
    return route._mapParams(
      extractParams(path, route._prefixPattern, route._keys)
    );
  }

  resolveSearch<R extends Routes>(route: R, search: string): SearchOfRoute<R> {
    return route._mapSearch(parseSearchParams(search));
  }

  navigate<P extends Paths>(options: NavigateOptions<P> | number) {
    if (typeof options === "number") {
      this.history.go(options);
    } else {
      const to = this.resolvePath(options);
      this.history.push(to, options.replace, options.data);
    }
  }
}
