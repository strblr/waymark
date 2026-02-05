import { inject } from "regexparam";
import { BrowserHistory } from "./browser-history";
import type { Route } from "../route";
import {
  normalizePath,
  mergeUrl,
  match,
  rankMatches,
  absolutePath
} from "../utils";
import type {
  RouteList,
  RouterOptions,
  Pattern,
  GetRoute,
  MatchOptions,
  Match,
  NavigateOptions,
  HistoryLike,
  HistoryPushOptions,
  LinkOptions,
  SSRContext
} from "../types";

export class Router {
  readonly routes: RouteList;
  readonly basePath: string;
  readonly history: HistoryLike;
  readonly ssrContext?: SSRContext;
  readonly defaultLinkOptions?: LinkOptions;
  private readonly _: { routeMap: Map<string, Route> };

  constructor(options: RouterOptions) {
    const {
      routes,
      basePath = "/",
      history,
      ssrContext,
      defaultLinkOptions
    } = options;
    this.routes = routes;
    this.basePath = normalizePath(basePath);
    this.history = history ?? new BrowserHistory();
    this.ssrContext = ssrContext;
    this.defaultLinkOptions = defaultLinkOptions;
    this._ = {
      routeMap: new Map(routes.map(route => [route._.pattern, route]))
    };
  }

  getRoute = <P extends Pattern>(pattern: P | GetRoute<P>) => {
    if (typeof pattern !== "string") {
      return pattern;
    }
    const route = this._.routeMap.get(pattern);
    if (!route) {
      throw new Error(`[Waymark] Route not found for ${pattern}`);
    }
    return route as GetRoute<P>;
  };

  match = <P extends Pattern>(
    path: string,
    options: MatchOptions<P>
  ): Match<P> | null => {
    const { from, strict, params: filter } = options;
    const route = this.getRoute(from);
    const params = match(route._, strict, path, this.basePath);
    return params &&
      (!filter || Object.keys(filter).every(key => filter[key] === params[key]))
      ? { route, params }
      : null;
  };

  matchAll = (path: string): Match | null => {
    const matches = this.routes
      .map(route => this.match(path, { from: route, strict: true }))
      .filter(m => !!m);
    return rankMatches(matches)[0] ?? null;
  };

  createUrl = <P extends Pattern>(options: NavigateOptions<P>) => {
    const { to, params = {}, search = {} } = options;
    const { pattern } = this.getRoute(to)._;
    const path = absolutePath(inject(pattern, params), this.basePath);
    return mergeUrl(path, search);
  };

  preload = async <P extends Pattern>(options: NavigateOptions<P>) => {
    const { to, params = {}, search = {} } = options;
    const { preloads } = this.getRoute(to)._;
    await Promise.all(preloads.map(preload => preload({ params, search })));
  };

  navigate = <P extends Pattern>(
    options: NavigateOptions<P> | HistoryPushOptions | number
  ) => {
    if (typeof options === "number") {
      this.history.go(options);
    } else if ("url" in options) {
      this.history.push(options);
    } else {
      const { replace, state } = options;
      this.history.push({ url: this.createUrl(options), replace, state });
    }
  };
}
