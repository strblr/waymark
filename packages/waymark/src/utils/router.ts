import type { RouteConfig } from "../route";
import type { MaybeOptional } from "./misc";

export interface RegisterRoutes {}

export type Paths = Routes["_"]["path"];

export type Routes = RouteList[number];

export type RouteList = RegisterRoutes extends {
  routes: infer RouteList extends ReadonlyArray<RouteConfig<string, any, any>>;
}
  ? RouteList
  : ReadonlyArray<RouteConfig<string, any, any>>;

export type RouteOf<P extends Paths> = Extract<Routes, { _: { path: P } }>;

export type ParamsOfPath<P extends Paths> = ParamsOfRoute<RouteOf<P>>;

export type SearchOfPath<P extends Paths> = SearchOfRoute<RouteOf<P>>;

export type ParamsOfRoute<R extends Routes> = R extends RouteConfig<
  string,
  infer Params,
  any
>
  ? Params
  : never;

export type SearchOfRoute<R extends Routes> = R extends RouteConfig<
  string,
  any,
  infer Search
>
  ? Search
  : never;

export type NavigateOptions<P extends Paths> = {
  to: P;
  replace?: boolean;
  data?: any;
} & MaybeOptional<ParamsOfPath<P>, "params"> &
  MaybeOptional<SearchOfPath<P>, "search">;

export interface HistoryLike {
  getPath: () => string;
  getSearch: () => string;
  getState: () => any;
  go: (delta: number) => void;
  push: (path: string, replace?: boolean, data?: any) => void;
  subscribe: (callback: () => void) => () => void;
}
