import type { Route } from "../route";
import type { MaybeKey } from "./misc";

export interface RegisterRoutes {}

export type RouteList = RegisterRoutes extends {
  routes: infer RouteList extends ReadonlyArray<Route<string, any, any>>;
}
  ? RouteList
  : ReadonlyArray<Route<string, any, any>>;

export type Routes = RouteList[number];

export type Patterns = Routes["_"]["pattern"];

export type RouteParams<R extends Routes> = NonNullable<R["_"]["_params"]>;

export type RouteSearch<R extends Routes> = NonNullable<R["_"]["_search"]>;

export type PatternParams<P extends Patterns> = RouteParams<PatternRoute<P>>;

export type PatternSearch<P extends Patterns> = RouteSearch<PatternRoute<P>>;

export type PatternRoute<P extends Patterns> = Extract<
  Routes,
  { _: { pattern: P } }
>;

export type NavigateOptions<P extends Patterns> = {
  to: P;
  replace?: boolean;
  state?: any;
} & MaybeKey<"params", PatternParams<P>> &
  MaybeKey<"search", PatternSearch<P>>;

export interface HistoryPushOptions {
  path: string;
  search?: string;
  replace?: boolean;
  state?: any;
}

export interface HistoryLike {
  getPath: () => string;
  getSearch: () => string;
  getState: () => any;
  go: (delta: number) => void;
  push: (options: HistoryPushOptions) => void;
  subscribe: (listener: () => void) => () => void;
}

export function rankRoutes(routes: Route<string, any, any>[]) {
  return [...routes].sort((a, b) => {
    const length = Math.max(a._.weights.length, b._.weights.length);
    for (let i = 0; i < length; i++) {
      const wa = a._.weights[i] ?? -1;
      const wb = b._.weights[i] ?? -1;
      if (wa !== wb) {
        return wb - wa;
      }
    }
    return 0;
  });
}
