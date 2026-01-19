import type { Route } from "../route";
import type { MaybeOptional, Pretty } from "./misc";

export interface RegisterRoutes {}

export type Paths = Routes["_path"];

export type Routes = RouteMap[keyof RouteMap];

export type RouteMap = RegisterRoutes extends {
  routes: infer RouteMap extends Record<string, Route<string, any, any>>;
}
  ? RouteMap
  : Record<string, Route<string, any, any>>;

export type NavigateOptions<P extends Paths> = Pretty<
  {
    to: P;
    replace?: boolean;
    data?: any;
  } & MaybeOptional<ParamsOf<P>, "params"> &
    MaybeOptional<SearchOf<P>, "search">
>;

export type ParamsOf<P extends Paths> = Extract<
  Routes,
  { _path: P }
> extends Route<string, infer Params, any>
  ? Params
  : never;

export type SearchOf<P extends Paths> = Extract<
  Routes,
  { _path: P }
> extends Route<string, any, infer Search>
  ? Search
  : {};

export interface HistoryLike {
  getPath(): string;
  getSearch(): string;
  getState(): any;
  go(delta: number): void;
  push(path: string, replace?: boolean, data?: any): void;
  subscribe(callback: () => void): () => void;
}
