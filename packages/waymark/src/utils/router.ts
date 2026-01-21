import type { Route } from "../route";
import type { MaybeKey } from "./misc";

export interface RegisterRoutes {}

export type Patterns = Routes["_"]["pattern"];

export type Routes = RouteList[number];

export type RouteOf<P extends Patterns> = Extract<
  Routes,
  { _: { pattern: P } }
>;

export type RouteList = RegisterRoutes extends {
  routes: infer RouteList extends ReadonlyArray<Route<string, any, any>>;
}
  ? RouteList
  : ReadonlyArray<Route<string, any, any>>;

export type ParamsOfPattern<P extends Patterns> = ParamsOfRoute<RouteOf<P>>;

export type SearchOfPattern<P extends Patterns> = SearchOfRoute<RouteOf<P>>;

export type ParamsOfRoute<R extends Routes> = NonNullable<R["_"]["_params"]>;

export type SearchOfRoute<R extends Routes> = NonNullable<R["_"]["_search"]>;

export type NavigateOptions<P extends Patterns> = {
  to: P;
  replace?: boolean;
  data?: any;
} & MaybeKey<"params", ParamsOfPattern<P>> &
  MaybeKey<"search", SearchOfPattern<P>>;

export interface HistoryLike {
  getPath: () => string;
  getSearch: () => string;
  getState: () => any;
  go: (delta: number) => void;
  push: (path: string, replace?: boolean, data?: any) => void;
  subscribe: (listener: () => void) => () => void;
}
