import type { Route } from "../route";
import type { MaybeOptional } from "./misc";

export interface RegisterRoutes {}

export type Paths = Routes["_path"];

export type Routes = RouteMap[keyof RouteMap];

export type RouteMap = RegisterRoutes extends {
  routes: infer RouteMap extends Record<string, Route<string, any, any>>;
}
  ? RouteMap
  : Record<string, Route<string, any, any>>;

export type NavigateOptions<P extends Paths> = {
  to: P;
  replace?: boolean;
  data?: any;
} & MaybeOptional<ParamsOfPath<P>, "params"> &
  MaybeOptional<SearchOfPath<P>, "search">;

export type ParamsOfPath<P extends Paths> = ParamsOfRoute<
  Extract<Routes, { _path: P }>
>;

export type SearchOfPath<P extends Paths> = SearchOfRoute<
  Extract<Routes, { _path: P }>
>;

export type ParamsOfRoute<R extends Routes> = R extends Route<
  string,
  infer Params,
  any
>
  ? Params
  : never;

export type SearchOfRoute<R extends Routes> = R extends Route<
  string,
  any,
  infer Search
>
  ? Search
  : never;

export interface HistoryLike {
  getPath(): string;
  getSearch(): string;
  getState(): any;
  go(delta: number): void;
  push(path: string, replace?: boolean, data?: any): void;
  subscribe(callback: () => void): () => void;
}
