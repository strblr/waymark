import { inject } from "regexparam";
import { BrowserHistory } from "./browser-history";
import type { LinkOptions } from "../react";
import {
  normalizePath,
  extract,
  stringifySearch,
  parseSearch,
  type Routes,
  type PatternRoute,
  type RouteList,
  type Patterns,
  type NavigateOptions,
  type HistoryLike,
  type RouteParams,
  type RouteSearch
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
  _: { routeMap: Map<string, Routes> };

  constructor(options: RouterOptions) {
    this.history = options.history ?? new BrowserHistory();
    this.basePath = normalizePath(options.basePath ?? "/");
    this.routes = options.routes;
    this.defaultLinkOptions = options.defaultLinkOptions;
    this._ = {
      routeMap: new Map(options.routes.map(route => [route._.pattern, route]))
    };
  }

  getPath(cpath: string): string {
    return normalizePath(`${this.basePath}/${cpath}`);
  }

  getCanonicalPath(path: string) {
    if (path === this.basePath || path.startsWith(`${this.basePath}/`)) {
      path = path.slice(this.basePath.length) || "/";
    }
    return path;
  }

  getRoute<P extends Patterns>(pattern: P) {
    const route = this._.routeMap.get(pattern);
    if (!route) {
      throw new Error(`Route not found for pattern: ${pattern}`);
    }
    return route as PatternRoute<P>;
  }

  getRouteMatch(path: string): Routes | undefined {
    const cpath = this.getCanonicalPath(path);
    return this.routes.find(route => route._.regex.test(cpath));
  }

  resolvePath<P extends Patterns>(options: NavigateOptions<P>) {
    const { to, params, search } = options;
    let cpath: string = to;
    params && (cpath = inject(cpath, params));
    let path = this.getPath(cpath);
    const searchString = search && stringifySearch(search);
    searchString && (path = `${path}?${searchString}`);
    return path;
  }

  resolveParams<R extends Routes>(route: R, path: string) {
    const cpath = this.getCanonicalPath(path);
    const { looseRegex, keys } = route._;
    return extract(cpath, looseRegex, keys) as RouteParams<R>;
  }

  resolveSearch<R extends Routes>(route: R, search: string) {
    return route._.mapSearch(parseSearch(search)) as RouteSearch<R>;
  }

  navigate<P extends Patterns>(options: NavigateOptions<P> | number) {
    if (typeof options === "number") {
      this.history.go(options);
    } else {
      const path = this.resolvePath(options);
      this.history.push(path, options.replace, options.data);
    }
  }
}
