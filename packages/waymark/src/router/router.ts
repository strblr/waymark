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

  matchPath(path: string): Routes | undefined {
    const cpath = this.getCanonicalPath(path);
    return this.routes.find(route => route._.regex.test(cpath));
  }

  getRoute<P extends Patterns>(pattern: P) {
    const route = this._.routeMap.get(pattern);
    if (!route) {
      throw new Error(`[Waymark] Route not found for pattern: ${pattern}`);
    }
    return route as PatternRoute<P>;
  }

  composePath<P extends Patterns>(options: NavigateOptions<P>) {
    const { to, params, search } = options;
    let cpath: string = to;
    params && (cpath = inject(cpath, params));
    let path = this.getPath(cpath);
    const searchString = search && stringifySearch(search);
    searchString && (path = `${path}?${searchString}`);
    return path;
  }

  decomposePath<R extends Routes>(
    route: R,
    path: string,
    searchString: string
  ) {
    const { keys, looseRegex, mapSearch } = route._;
    const cpath = this.getCanonicalPath(path);
    const params: RouteParams<R> = extract(cpath, looseRegex, keys);
    const search: RouteSearch<R> = mapSearch(parseSearch(searchString));
    return { params, search };
  }

  navigate<P extends Patterns>(options: NavigateOptions<P> | number) {
    if (typeof options === "number") {
      this.history.go(options);
    } else {
      const path = this.composePath(options);
      this.history.push(path, options.replace, options.data);
    }
  }
}
