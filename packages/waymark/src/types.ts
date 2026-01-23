import type { ComponentType } from "react";
import type { Route } from "./route";
import type { MaybeKey } from "./utils";

export interface Register {}

// Router

export type RouteList = Register extends {
  routes: infer RouteList extends ReadonlyArray<Route<string, any, any>>;
}
  ? RouteList
  : ReadonlyArray<Route<string, any, any>>;

export type Routes = RouteList[number];

export type Patterns = Routes["pattern"];

export type RouteParams<R extends Routes> = NonNullable<R["_"]["_params"]>;

export type RouteSearch<R extends Routes> = NonNullable<R["_"]["_search"]>;

export type PatternParams<P extends Patterns> = RouteParams<PatternRoute<P>>;

export type PatternSearch<P extends Patterns> = RouteSearch<PatternRoute<P>>;

export type PatternRoute<P extends Patterns> = Extract<Routes, { pattern: P }>;

export type NavigateOptions<P extends Patterns> = {
  to: P;
  replace?: boolean;
  state?: any;
} & MaybeKey<"params", PatternParams<P>> &
  MaybeKey<"search", PatternSearch<P>>;

// History

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

// React

export type Updater<T extends object> = Partial<T> | ((prev: T) => Partial<T>);

export type ComponentLoader = () => Promise<
  ComponentType | { default: ComponentType }
>;
