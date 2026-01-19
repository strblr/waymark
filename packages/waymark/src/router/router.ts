import { inject } from "regexparam";
import { BrowserHistory } from "./browser-history";
import type { LinkOptions } from "../react";
import {
  normalizePath,
  extractParams,
  toSearchString,
  parseSearchParams,
  type Routes,
  type RouteMap,
  type Paths,
  type NavigateOptions,
  type HistoryLike,
  type SearchOfRoute,
  type ParamsOfRoute
} from "../utils";

export interface RouterOptions {
  history?: HistoryLike;
  basePath?: string;
  routes: RouteMap;
  defaultLinkOptions?: LinkOptions;
}

export class Router {
  history: HistoryLike;
  basePath: string;
  routes: RouteMap;
  defaultLinkOptions?: LinkOptions;
  private _routes: Routes[];

  constructor(options: RouterOptions) {
    this.history = options.history ?? new BrowserHistory();
    this.basePath = normalizePath(options.basePath ?? "/");
    this.routes = options.routes;
    this.defaultLinkOptions = options.defaultLinkOptions;
    this._routes = Object.values(this.routes);
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
    return this._routes.find(route => route._pattern.test(path));
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
    return route._mapParams(extractParams(path, route._pattern, route._keys));
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
