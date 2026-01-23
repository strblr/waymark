import { inject } from "regexparam";
import { BrowserHistory } from "./browser-history";
import type { LinkOptions } from "../react";
import {
  normalizePath,
  extract,
  rankRoutes,
  stringifySearch,
  parseSearch
} from "../utils";
import type {
  Routes,
  PatternRoute,
  RouteList,
  Patterns,
  NavigateOptions,
  HistoryLike,
  RouteParams,
  RouteSearch
} from "../types";

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
      routeMap: new Map(options.routes.map(route => [route.pattern, route]))
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
    const matches = this.routes.filter(route => route._.regex.test(cpath));
    return rankRoutes(matches)[0];
  }

  getRoute<P extends Patterns>(pattern: P) {
    const route = this._.routeMap.get(pattern);
    if (!route) {
      throw new Error(`[Waymark] Route not found for pattern: ${pattern}`);
    }
    return route as PatternRoute<P>;
  }

  compose<P extends Patterns>(options: NavigateOptions<P>) {
    const { to, params, search } = options;
    return {
      path: this.getPath(params ? inject(to, params) : to),
      search: search ? stringifySearch(search) : ""
    };
  }

  decompose<R extends Routes>(route: R, path: string, search: string) {
    const { keys, looseRegex, mapSearch } = route._;
    const cpath = this.getCanonicalPath(path);
    return {
      params: extract(cpath, looseRegex, keys) as RouteParams<R>,
      search: mapSearch(parseSearch(search)) as RouteSearch<R>
    };
  }

  navigate<P extends Patterns>(options: NavigateOptions<P> | number) {
    if (typeof options === "number") {
      this.history.go(options);
    } else {
      const { path, search } = this.compose(options);
      const { replace, state } = options;
      this.history.push({ path, search, replace, state });
    }
  }
}
