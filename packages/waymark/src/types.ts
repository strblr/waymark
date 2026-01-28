import type { ComponentType, CSSProperties } from "react";
import type { Route } from "./route";
import type { MaybeKey } from "./utils";

// Register

export interface Register {}

export type RouteList = Register extends {
  routes: infer RouteList extends ReadonlyArray<Route>;
}
  ? RouteList
  : ReadonlyArray<Route>;

export type Handle = Register extends { handle: infer Handle } ? Handle : any;

// Route

export interface PreloadContext<R extends Route = Route> {
  params: R["_types"]["params"];
  search: R["_types"]["search"];
}

// Router

export interface RouterOptions {
  basePath?: string;
  routes: RouteList;
  history?: HistoryLike;
  ssrContext?: SSRContext;
  defaultLinkOptions?: LinkOptions;
}

export type Pattern = RouteList[number]["pattern"];

export type GetRoute<P extends Pattern> = Extract<
  RouteList[number],
  { pattern: P }
>;

export type Params<P extends Pattern> = GetRoute<P>["_types"]["params"];

export type Search<P extends Pattern> = GetRoute<P>["_types"]["search"];

export type MatchOptions<P extends Pattern> = {
  from: P | GetRoute<P>;
  strict?: boolean;
  params?: Partial<Params<P>>;
};

export type Match<P extends Pattern = Pattern> = {
  route: GetRoute<P>;
  params: Params<P>;
};

export type NavigateOptions<P extends Pattern> = {
  to: P | GetRoute<P>;
  replace?: boolean;
  state?: any;
} & MaybeKey<"params", Params<P>> &
  MaybeKey<"search", Search<P>>;

export interface LinkOptions {
  strict?: boolean;
  preload?: "intent" | "render" | "viewport" | false;
  style?: CSSProperties;
  className?: string;
  activeStyle?: CSSProperties;
  activeClassName?: string;
}

export type SSRContext = {
  redirect?: string;
  statusCode?: number;
};

// History

export interface HistoryPushOptions {
  url: string;
  replace?: boolean;
  state?: any;
}

export interface HistoryLike {
  getPath: () => string;
  getSearch: () => Record<string, unknown>;
  getState: () => any;
  go: (delta: number) => void;
  push: (options: HistoryPushOptions) => void;
  subscribe: (listener: () => void) => () => void;
}

// React

export type Updater<T extends object> = Partial<T> | ((prev: T) => Partial<T>);

export type ComponentLoader = () => Promise<
  ComponentType | { default: ComponentType }
>;
