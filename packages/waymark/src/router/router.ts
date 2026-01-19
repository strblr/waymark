import { inject } from "regexparam";
import { BrowserHistory } from "./browser-history";
import {
  normalizePath,
  toSearchString,
  type Routes,
  type RouteMap,
  type Paths,
  type NavigateOptions,
  type HistoryLike,
  parseSearchParams,
  extractParams
} from "../utils";

export interface RouterOptions {
  history?: HistoryLike;
  basePath?: string;
  routes: RouteMap;
}

export class Router {
  history: HistoryLike;
  routes: RouteMap;
  basePath: string;
  private _routes: Routes[];

  constructor(options: RouterOptions) {
    this.history = options.history ?? new BrowserHistory();
    this.routes = options.routes;
    this.basePath = normalizePath(options.basePath ?? "/");
    this._routes = Object.values(this.routes);
  }

  getRouteMatch() {
    let path = this.history.getPath();
    if (path === this.basePath || path.startsWith(`${this.basePath}/`)) {
      path = path.slice(this.basePath.length) || "/";
    }
    return this._routes.find(route => route._pattern.test(path));
  }

  resolvePath<P extends Paths>(options: NavigateOptions<P>) {
    const { to, params, search } = options;
    let path: string = to;
    params && (path = inject(path, params));
    path = normalizePath(`${this.basePath}/${path}`);
    const searchString = search && toSearchString(search);
    searchString && (path = `${path}?${searchString}`);
    return path;
  }

  resolveParams<R extends Routes>(route: R, path: string) {
    return route._mapParams(extractParams(path, route._pattern, route._keys));
  }

  resolveSearch<R extends Routes>(route: R, search: string) {
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
