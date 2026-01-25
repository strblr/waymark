import { inject } from "regexparam";
import { BrowserHistory } from "./browser-history";
import type { Route } from "../route";
import type { LinkOptions } from "../react";
import {
  normalizePath,
  mergeUrl,
  matchRegex,
  rankMatches,
  absolutePath
} from "../utils";
import type {
  RouteList,
  Pattern,
  GetRoute,
  MatchOptions,
  Match,
  NavigateOptions,
  HistoryLike,
  HistoryPushOptions
} from "../types";

export interface RouterOptions {
  basePath?: string;
  routes: RouteList;
  history?: HistoryLike;
  defaultLinkOptions?: LinkOptions;
}

export class Router {
  readonly basePath: string;
  readonly routes: RouteList;
  readonly history: HistoryLike;
  readonly defaultLinkOptions?: LinkOptions;
  readonly _: { routeMap: Map<string, Route> };

  constructor(options: RouterOptions) {
    const { basePath = "/", routes, history, defaultLinkOptions } = options;
    this.basePath = normalizePath(basePath);
    this.routes = routes;
    this.history = history ?? new BrowserHistory();
    this.defaultLinkOptions = defaultLinkOptions;
    this._ = {
      routeMap: new Map(routes.map(route => [route.pattern, route]))
    };
  }

  getRoute<P extends Pattern>(pattern: P | GetRoute<P>) {
    if (typeof pattern !== "string") {
      return pattern;
    }
    const route = this._.routeMap.get(pattern);
    if (!route) {
      throw new Error(`[Waymark] Route not found for pattern: ${pattern}`);
    }
    return route as GetRoute<P>;
  }

  match<P extends Pattern>(
    path: string,
    options: MatchOptions<P>
  ): Match<P> | null {
    const { from, strict, params: filter } = options;
    const route = this.getRoute(from);
    const regex = strict ? route._.regex : route._.looseRegex;
    const params = matchRegex(regex, route._.keys, path, this.basePath);
    if (
      !params ||
      (filter && Object.keys(filter).some(key => filter[key] !== params[key]))
    ) {
      return null;
    }
    return { route, params };
  }

  matchAll(path: string): Match | null {
    const matches = this.routes
      .map(route => this.match(path, { from: route, strict: true }))
      .filter(m => !!m);
    return rankMatches(matches)[0] ?? null;
  }

  createUrl<P extends Pattern>(options: NavigateOptions<P>) {
    const { to, params = {}, search = {} } = options;
    const { pattern } = this.getRoute(to);
    const path = absolutePath(inject(pattern, params), this.basePath);
    return mergeUrl(path, search);
  }

  navigate<P extends Pattern>(
    options: NavigateOptions<P> | HistoryPushOptions | number
  ) {
    if (typeof options === "number") {
      this.history.go(options);
    } else if ("url" in options) {
      this.history.push(options);
    } else {
      const { replace, state } = options;
      this.history.push({ url: this.createUrl(options), replace, state });
    }
  }
}
